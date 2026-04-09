package search_service

import (
	"errors"
	"fmt"
	"math"
	"strings"

	"myblogx/models"
	"myblogx/models/enum"
	"myblogx/service/es_service"
	"myblogx/utils/jwts"
)

func SearchArticles(cr ArticleSearchRequest, claims *jwts.MyClaims) (ArticleSearchResponse, error) {
	normalized, err := normalizeArticleSearchRequest(cr, claims)
	if err != nil {
		return ArticleSearchResponse{}, err
	}

	query, err := buildArticleSearchDSL(normalized, claims)
	if err != nil {
		return ArticleSearchResponse{}, err
	}

	extraBody := buildArticleSearchExtraBodyBySort(normalized.Sort, normalized.Key)
	return executeArticleSearch(normalized, query, extraBody)
}

func SearchArticleList(cr ArticleSearchRequest, claims *jwts.MyClaims) ([]SearchListResponse, error) {
	result, err := SearchArticles(cr, claims)
	if err != nil {
		return nil, err
	}
	return result.List, nil
}

func normalizeArticleSearchRequest(cr ArticleSearchRequest, claims *jwts.MyClaims) (ArticleSearchRequest, error) {
	cr.Type = cr.NormalizeType()
	cr.Sort = cr.NormalizeSort()
	cr.PageMode = cr.NormalizePageMode()
	cr.AuthorID = cr.NormalizeAuthorID()
	cr.Key = strings.TrimSpace(cr.Key)

	if cr.Type < 1 || cr.Type > 5 {
		return cr, errors.New("搜索类型错误")
	}
	if cr.Sort < 1 || cr.Sort > 6 {
		return cr, errors.New("搜索排序错误")
	}
	if cr.PageMode != PageModeHasMore && cr.PageMode != PageModeCount {
		return cr, errors.New("分页模式错误")
	}

	switch cr.Type {
	case 1:
		if cr.Status == 0 {
			cr.Status = enum.ArticleStatusPublished
		}
		if cr.Status != enum.ArticleStatusPublished {
			return cr, errors.New("公共文章列表只能查询已发布文章")
		}
	case 2:
		if cr.Status == 0 {
			cr.Status = enum.ArticleStatusPublished
		}
		if cr.Status != enum.ArticleStatusPublished {
			return cr, errors.New("推荐文章列表只能查询已发布文章")
		}
	case 3:
		if cr.AuthorID == 0 {
			return cr, errors.New("作者文章必须传 author_id")
		}
		if cr.Status == 0 {
			cr.Status = enum.ArticleStatusPublished
		}
		if cr.Status != enum.ArticleStatusPublished {
			return cr, errors.New("作者文章只能查询已发布文章")
		}
	case 4:
		if claims == nil {
			return cr, errors.New("未登录")
		}
		cr.AuthorID = claims.UserID
		if cr.Status == enum.ArticleStatusDeleted {
			return cr, errors.New("不能搜索已删除的文章")
		}
	case 5:
		if claims == nil || !claims.IsAdmin() {
			return cr, errors.New("权限错误")
		}
	default:
		return cr, errors.New("搜索类型错误")
	}

	return cr, nil
}

func buildArticleSearchDSL(cr ArticleSearchRequest, claims *jwts.MyClaims) (map[string]any, error) {
	query := buildDefaultArticleSearchQuery(cr.Key)

	switch cr.Type {
	case 1:
		query = buildPublishedStatusQuery(query, cr.Status)
	case 2:
		query = buildPublishedStatusQuery(query, cr.Status)
		if claims != nil {
			query = buildLikeTagsQuery(query, claims.UserID)
		}
	case 3:
		query = buildPublishedStatusQuery(query, cr.Status)
		query = buildAuthorIDQuery(query, cr.AuthorID)
	case 4:
		query = buildSelfArticleSearchQuery(cr.Key, cr.AuthorID, cr.Status)
	case 5:
		query = buildAdminArticleSearchQuery(cr.Key, cr.Status)
	default:
		return nil, errors.New("搜索类型错误")
	}

	if len(cr.TagIDs) > 0 {
		query = buildTagIDsQuery(query, cr.TagIDs)
	} else if len(cr.LegacyTagList) > 0 {
		query = buildTagListQuery(query, cr.LegacyTagList)
	}

	if cr.CategoryID != 0 {
		query = buildCategoryIDQuery(query, cr.CategoryID)
	}

	return query, nil
}

func buildPublishedStatusQuery(query map[string]any, status enum.ArticleStatus) map[string]any {
	boolQuery, ok := extractSearchBoolQuery(query)
	if !ok {
		return query
	}

	filters, _ := boolQuery["filter"].([]any)
	filtered := make([]any, 0, len(filters))
	for _, item := range filters {
		termMap, ok := item.(map[string]any)
		if !ok {
			filtered = append(filtered, item)
			continue
		}
		termBody, ok := termMap["term"].(map[string]any)
		if !ok {
			filtered = append(filtered, item)
			continue
		}
		if _, hasStatus := termBody["status"]; hasStatus {
			continue
		}
		filtered = append(filtered, item)
	}
	filtered = append(filtered, map[string]any{
		"term": map[string]any{
			"status": status,
		},
	})
	boolQuery["filter"] = filtered
	return query
}

func executeArticleSearch(cr ArticleSearchRequest, query map[string]any, extraBody map[string]any) (ArticleSearchResponse, error) {
	page := cr.NormalizePage()
	limit := cr.GetLimit()

	searchBody := map[string]any{
		"from":             (page - 1) * limit,
		"size":             limit,
		"query":            query,
		"track_total_hits": cr.PageMode == PageModeCount,
	}

	for key, value := range extraBody {
		searchBody[key] = value
	}
	if cr.PageMode == PageModeHasMore {
		searchBody["size"] = limit + 1
	}

	resp := es_service.SearchBody(models.ArticleModel{}.Index(), searchBody)
	if !resp.Success {
		return ArticleSearchResponse{}, errors.New(resp.Msg)
	}

	data, ok := resp.Data.(map[string]any)
	if !ok {
		return ArticleSearchResponse{}, errors.New("搜索结果格式错误")
	}

	list := extractArticleSearchResults(data)
	pagination := SearchPagination{
		Mode:    cr.PageMode,
		Page:    page,
		Limit:   limit,
		HasMore: false,
	}

	if cr.PageMode == PageModeHasMore {
		if len(list) > limit {
			pagination.HasMore = true
			list = list[:limit]
		}
		return ArticleSearchResponse{
			List:       list,
			Pagination: pagination,
		}, nil
	}

	totalRaw, _ := data["value"].(float64)
	total := int(totalRaw)
	hasMore := page*limit < total
	totalPages := 0
	if total > 0 {
		totalPages = int(math.Ceil(float64(total) / float64(limit)))
	}
	pagination.HasMore = hasMore
	pagination.Total = &total
	pagination.TotalPages = &totalPages

	return ArticleSearchResponse{
		List:       list,
		Pagination: pagination,
	}, nil
}

func buildArticleSearchExtraBodyBySort(sort int8, key string) map[string]any {
	switch sort {
	case 2:
		return buildArticleSearchExtraBody("created_at", key)
	case 3:
		return buildArticleSearchExtraBody("comment_count", key)
	case 4:
		return buildArticleSearchExtraBody("digg_count", key)
	case 5:
		return buildArticleSearchExtraBody("favor_count", key)
	case 6:
		return buildArticleSearchExtraBody("view_count", key)
	default:
		return buildArticleSearchExtraBody("", key)
	}
}

func (p PageMode) String() string {
	return string(p)
}

func (cr ArticleSearchRequest) String() string {
	return fmt.Sprintf("type=%d sort=%d mode=%s", cr.Type, cr.Sort, cr.PageMode)
}
