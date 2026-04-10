package search_api

import (
	"myblogx/common/res"
	"myblogx/middleware"
	"myblogx/models/ctype"
	"myblogx/service/redis_service"
	"myblogx/service/search_service"
	"myblogx/service/user_service"
	"myblogx/utils/jwts"
	"strings"

	"github.com/gin-gonic/gin"
)

func (SearchApi) ArticleSearchView(c *gin.Context) {
	cr := middleware.GetBindQuery[search_service.ArticleSearchRequest](c)
	if len(cr.TagIDs) == 0 {
		cr.TagIDs = parseTagIDsFromGin(c)
	}

	var claims *jwts.MyClaims
	if authResult := user_service.MustAuthenticateAccessTokenByGin(c); authResult != nil {
		claims = authResult.Claims
	}

	app := mustApp(c)
	result, err := search_service.SearchArticles(cr, claims, app.DB, redis_service.DepsFromGin(c), app.ESClient, app.Config.ES.Index)
	if err != nil {
		res.FailWithMsg(err.Error(), c)
		return
	}
	res.OkWithData(result, c)
}

func parseTagIDsFromGin(c *gin.Context) []ctype.ID {
	rawList := c.QueryArray("tag_ids")
	if len(rawList) == 0 {
		if joined := strings.TrimSpace(c.Query("tag_ids")); joined != "" {
			rawList = strings.Split(joined, ",")
		}
	}

	result := make([]ctype.ID, 0, len(rawList))
	seen := make(map[ctype.ID]struct{}, len(rawList))
	for _, raw := range rawList {
		var id ctype.ID
		if err := id.UnmarshalText([]byte(strings.TrimSpace(raw))); err != nil || id == 0 {
			continue
		}
		if _, ok := seen[id]; ok {
			continue
		}
		seen[id] = struct{}{}
		result = append(result, id)
	}
	return result
}
