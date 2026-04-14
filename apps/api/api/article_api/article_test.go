package article_api

import (
	"encoding/json"
	"fmt"
	"myblogx/conf"
	confsite "myblogx/conf/site"
	"myblogx/models"
	"myblogx/models/ctype"
	"myblogx/models/enum"
	"myblogx/models/enum/message_enum"
	"myblogx/service/site_service"
	"myblogx/test/testutil"
	"myblogx/utils/jwts"
	"myblogx/utils/markdown"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
)

func newCtx() (*gin.Context, *httptest.ResponseRecorder) {
	gin.SetMode(gin.TestMode)
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	return c, w
}

func readCode(t *testing.T, w *httptest.ResponseRecorder) int {
	t.Helper()
	var body map[string]any
	if err := json.Unmarshal(w.Body.Bytes(), &body); err != nil {
		t.Fatalf("解析响应失败: %v", err)
	}
	return int(body["code"].(float64))
}

func readBody(t *testing.T, w *httptest.ResponseRecorder) map[string]any {
	t.Helper()
	var body map[string]any
	if err := json.Unmarshal(w.Body.Bytes(), &body); err != nil {
		t.Fatalf("解析响应失败: %v", err)
	}
	return body
}

func ptrOf[T any](v T) *T {
	return &v
}

func setupArticleEnv(t *testing.T) *models.UserModel {
	t.Helper()
	_ = testutil.SetupMiniRedis(t)
	db := testutil.SetupSQLite(
		t,
		&models.UserModel{},
		&models.UserConfModel{},
		&models.UserStatModel{},
		&models.RuntimeSiteConfigModel{},
		&models.CategoryModel{},
		&models.ArticleModel{},
		&models.ArticleReviewTaskModel{},
		&models.ArticleReviewLogModel{},
		&models.TagModel{},
		&models.ArticleTagModel{},
		&models.ArticleDiggModel{},
		&models.FavoriteModel{},
		&models.UserArticleFavorModel{},
		&models.UserTopArticleModel{},
		&models.UserArticleViewHistoryModel{},
		&models.ImageRefModel{},
		&models.CommentModel{},
		&models.ArticleMessageModel{},
	)
	testutil.SetConfig(&conf.Config{
		Jwt: conf.Jwt{
			Expire: 1,
			Secret: "article-secret",
			Issuer: "article-test",
		},
		Site: conf.Site{
			SiteInfo: confsite.SiteInfo{Mode: enum.SiteModeCommunity},
			Article:  confsite.Article{SkipExamining: false},
		},
	})

	user := &models.UserModel{
		Username: "u1",
		Password: "x",
		Abstract: "backend author",
		Role:     enum.RoleUser,
	}
	if err := db.Create(user).Error; err != nil {
		t.Fatalf("创建用户失败: %v", err)
	}
	return user
}

func setupArticleAPI(t *testing.T) ArticleApi {
	t.Helper()

	cfg := testutil.Config()
	runtimeSvc := site_service.NewRuntimeConfigService(cfg.Site, cfg.AI, testutil.Logger(), testutil.DB(), "")
	if err := runtimeSvc.InitRuntimeConfig(); err != nil {
		t.Fatalf("初始化运行时配置失败: %v", err)
	}

	return New(Deps{
		DB:          testutil.DB(),
		JWT:         cfg.Jwt,
		Logger:      testutil.Logger(),
		Redis:       testutil.Redis(),
		RuntimeSite: runtimeSvc,
	})
}

func waitArticleMessageCount(t *testing.T, want int) []models.ArticleMessageModel {
	t.Helper()

	deadline := time.Now().Add(2 * time.Second)
	for time.Now().Before(deadline) {
		var list []models.ArticleMessageModel
		if err := testutil.DB().Order("id asc").Find(&list).Error; err != nil {
			t.Fatalf("查询消息失败: %v", err)
		}
		if len(list) == want {
			return list
		}
		time.Sleep(20 * time.Millisecond)
	}

	var list []models.ArticleMessageModel
	if err := testutil.DB().Order("id asc").Find(&list).Error; err != nil {
		t.Fatalf("查询消息失败: %v", err)
	}
	t.Fatalf("等待消息数量超时: got=%d want=%d", len(list), want)
	return nil
}

func TestArticleCreateUpdateReviewAndRemove(t *testing.T) {
	user := setupArticleEnv(t)
	db := testutil.DB()

	cat := models.CategoryModel{Title: "go", UserID: user.ID}
	if err := db.Create(&cat).Error; err != nil {
		t.Fatalf("创建分类失败: %v", err)
	}
	tag := models.TagModel{Title: "Golang", IsEnabled: true}
	if err := db.Create(&tag).Error; err != nil {
		t.Fatalf("创建标签失败: %v", err)
	}

	api := setupArticleAPI(t)
	claims := &jwts.MyClaims{Claims: jwts.Claims{UserID: user.ID, Role: enum.RoleUser, Username: user.Username}}

	{
		c, w := newCtx()
		c.Set("claims", claims)
		c.Set("requestJson", ArticleCreateRequest{
			Title:          "t1",
			Content:        "content",
			CategoryID:     &cat.ID,
			TagIDs:         []ctype.ID{tag.ID},
			CommentsToggle: true,
			Status:         enum.ArticleStatusExamining,
		})
		api.ArticleCreateView(c)
		if code := readCode(t, w); code != 0 {
			t.Fatalf("创建文章失败, code=%d body=%s", code, w.Body.String())
		}
		body := readBody(t, w)
		data := body["data"].(map[string]any)
		if _, ok := data["id"].(string); !ok {
			t.Fatalf("创建文章返回的 id 应为字符串, body=%s", w.Body.String())
		}
	}

	var created models.ArticleModel
	if err := db.Order("id desc").Preload("Tags").First(&created).Error; err != nil {
		t.Fatalf("查询创建文章失败: %v", err)
	}
	if len(created.Tags) != 1 || created.Tags[0].Title != tag.Title {
		t.Fatalf("创建文章后标签关系未正确写入: %+v", created.Tags)
	}

	var relationCount int64
	if err := db.Model(&models.ArticleTagModel{}).
		Where("article_id = ? AND tag_id = ?", created.ID, tag.ID).
		Count(&relationCount).Error; err != nil {
		t.Fatalf("查询文章标签关系失败: %v", err)
	}
	if relationCount != 1 {
		t.Fatalf("文章标签关系应已创建, count=%d", relationCount)
	}

	var createdStat models.UserStatModel
	if err := db.Take(&createdStat, "user_id = ?", user.ID).Error; err != nil {
		t.Fatalf("查询作者统计失败: %v", err)
	}
	if createdStat.ArticleCount != 1 || createdStat.ArticleVisitedCount != 0 {
		t.Fatalf("创建文章后的作者统计异常: %+v", createdStat)
	}

	{
		c, w := newCtx()
		c.Set("claims", claims)
		c.Set("requestUri", models.IDRequest{ID: created.ID})
		c.Set("requestJson", ArticleUpdateRequest{
			Title:          ptrOf("t1-updated"),
			Content:        ptrOf("new content"),
			CategoryID:     &cat.ID,
			TagIDs:         &[]ctype.ID{tag.ID},
			CommentsToggle: ptrOf(false),
		})
		api.ArticleUpdateView(c)
		if code := readCode(t, w); code != 0 {
			t.Fatalf("更新文章失败, code=%d body=%s", code, w.Body.String())
		}
	}
	if err := db.Preload("Tags").Take(&created, created.ID).Error; err != nil {
		t.Fatalf("回查更新后的文章失败: %v", err)
	}
	if len(created.Tags) != 1 || created.Tags[0].Title != tag.Title {
		t.Fatalf("更新文章后标签关系未正确写入: %+v", created.Tags)
	}

	var task models.ArticleReviewTaskModel
	if err := db.Order("id desc").Take(&task, "article_id = ?", created.ID).Error; err != nil {
		t.Fatalf("查询审核任务失败: %v", err)
	}

	admin := &jwts.MyClaims{Claims: jwts.Claims{UserID: user.ID, Role: enum.RoleAdmin, Username: "admin"}}
	{
		c, w := newCtx()
		c.Set("claims", admin)
		c.Set("requestUri", models.IDRequest{ID: task.ID})
		c.Set("requestJson", ArticleReviewHandleRequest{Status: enum.ArticleStatusPublished})
		api.ArticleReviewTaskHandleView(c)
		if code := readCode(t, w); code != 0 {
			t.Fatalf("处理审核任务失败, code=%d body=%s", code, w.Body.String())
		}
	}

	messages := waitArticleMessageCount(t, 1)
	if messages[0].Type != message_enum.SystemType {
		t.Fatalf("文章审核消息类型错误: %+v", messages[0])
	}
	if messages[0].ReceiverID != user.ID {
		t.Fatalf("文章审核消息接收者错误: %+v", messages[0])
	}
	if messages[0].Content != fmt.Sprintf("您的文章《%s》审核通过！", "t1-updated") {
		t.Fatalf("文章审核消息内容错误: %+v", messages[0])
	}
	if messages[0].LinkHerf != fmt.Sprintf("/article/%d", created.ID) {
		t.Fatalf("文章审核消息链接错误: %+v", messages[0])
	}

	{
		c, w := newCtx()
		c.Set("requestJson", models.IDListRequest{IDList: []ctype.ID{created.ID}})
		api.ArticleRemoveView(c)
		if code := readCode(t, w); code != 0 {
			t.Fatalf("删除文章失败, code=%d body=%s", code, w.Body.String())
		}
	}

	var removedStat models.UserStatModel
	if err := db.Take(&removedStat, "user_id = ?", user.ID).Error; err != nil {
		t.Fatalf("查询删除后的作者统计失败: %v", err)
	}
	if removedStat.ArticleCount != 0 || removedStat.ArticleVisitedCount != 0 {
		t.Fatalf("删除文章后的作者统计异常: %+v", removedStat)
	}
}

func TestArticleUpdateViewOnlyUpdatesProvidedFields(t *testing.T) {
	user := setupArticleEnv(t)
	db := testutil.DB()

	cat := models.CategoryModel{Title: "go", UserID: user.ID}
	if err := db.Create(&cat).Error; err != nil {
		t.Fatalf("创建分类失败: %v", err)
	}
	tag := models.TagModel{Title: "Golang", IsEnabled: true}
	if err := db.Create(&tag).Error; err != nil {
		t.Fatalf("创建标签失败: %v", err)
	}

	article := models.ArticleModel{
		Title:          "old title",
		Abstract:       "manual abstract",
		Content:        "old content",
		CategoryID:     &cat.ID,
		Cover:          "old-cover",
		AuthorID:       user.ID,
		CommentsToggle: true,
		Status:         enum.ArticleStatusExamining,
	}
	if err := db.Create(&article).Error; err != nil {
		t.Fatalf("创建文章失败: %v", err)
	}
	if err := db.Create(&models.ArticleTagModel{ArticleID: article.ID, TagID: tag.ID}).Error; err != nil {
		t.Fatalf("创建文章标签关系失败: %v", err)
	}

	api := setupArticleAPI(t)
	claims := &jwts.MyClaims{Claims: jwts.Claims{UserID: user.ID, Role: enum.RoleUser, Username: user.Username}}

	{
		c, w := newCtx()
		c.Set("claims", claims)
		c.Set("requestUri", models.IDRequest{ID: article.ID})
		c.Set("requestJson", ArticleUpdateRequest{
			Content: ptrOf("new content"),
		})
		api.ArticleUpdateView(c)
		if code := readCode(t, w); code != 0 {
			t.Fatalf("部分更新文章失败, code=%d body=%s", code, w.Body.String())
		}
	}

	if err := db.Preload("Tags").Take(&article, article.ID).Error; err != nil {
		t.Fatalf("回查更新后的文章失败: %v", err)
	}
	if article.Title != "old title" {
		t.Fatalf("未传 title 不应更新, got=%s", article.Title)
	}
	if article.Abstract != "manual abstract" {
		t.Fatalf("未传 abstract 不应更新, got=%s", article.Abstract)
	}
	if article.Content != markdown.MdToSafe("new content") {
		t.Fatalf("已传 content 应更新为安全 Markdown, got=%q", article.Content)
	}
	if article.Cover != "old-cover" {
		t.Fatalf("未传 cover 不应更新, got=%s", article.Cover)
	}
	if !article.CommentsToggle {
		t.Fatal("未传 comments_toggle 不应更新")
	}
	if article.CategoryID == nil || *article.CategoryID != cat.ID {
		t.Fatalf("未传 category_id 不应更新, got=%v", article.CategoryID)
	}
	if len(article.Tags) != 1 || article.Tags[0].Title != tag.Title {
		t.Fatalf("未传 tag_ids 不应更新标签关系, got=%+v", article.Tags)
	}

	var relationCount int64
	if err := db.Model(&models.ArticleTagModel{}).
		Where("article_id = ? AND tag_id = ?", article.ID, tag.ID).
		Count(&relationCount).Error; err != nil {
		t.Fatalf("查询文章标签关系失败: %v", err)
	}
	if relationCount != 1 {
		t.Fatalf("未传 tag_ids 不应更新标签关系, count=%d", relationCount)
	}
}

func TestArticleUpdateViewCategoryIDZeroClearsCategory(t *testing.T) {
	user := setupArticleEnv(t)
	db := testutil.DB()

	cat := models.CategoryModel{Title: "go", UserID: user.ID}
	if err := db.Create(&cat).Error; err != nil {
		t.Fatalf("创建分类失败: %v", err)
	}

	article := models.ArticleModel{
		Title:      "old title",
		Content:    "old content",
		CategoryID: &cat.ID,
		AuthorID:   user.ID,
		Status:     enum.ArticleStatusExamining,
	}
	if err := db.Create(&article).Error; err != nil {
		t.Fatalf("创建文章失败: %v", err)
	}

	api := setupArticleAPI(t)
	claims := &jwts.MyClaims{Claims: jwts.Claims{UserID: user.ID, Role: enum.RoleUser, Username: user.Username}}
	clearID := ctype.ID(0)

	{
		c, w := newCtx()
		c.Set("claims", claims)
		c.Set("requestUri", models.IDRequest{ID: article.ID})
		c.Set("requestJson", ArticleUpdateRequest{
			CategoryID: &clearID,
		})
		api.ArticleUpdateView(c)
		if code := readCode(t, w); code != 0 {
			t.Fatalf("清空文章分类失败, code=%d body=%s", code, w.Body.String())
		}
	}

	var updated models.ArticleModel
	if err := db.Take(&updated, article.ID).Error; err != nil {
		t.Fatalf("回查清空分类后的文章失败: %v", err)
	}
	if updated.CategoryID != nil {
		t.Fatalf("传 category_id=0 应清空分类, got=%v", *updated.CategoryID)
	}
}

func TestArticleDiggFavoriteVisitDetailRemoveUser(t *testing.T) {
	user := setupArticleEnv(t)
	db := testutil.DB()
	api := setupArticleAPI(t)

	category := models.CategoryModel{Title: "后端", UserID: user.ID}
	if err := db.Create(&category).Error; err != nil {
		t.Fatalf("创建分类失败: %v", err)
	}
	tag := models.TagModel{Title: "Backend", IsEnabled: true}
	if err := db.Create(&tag).Error; err != nil {
		t.Fatalf("创建标签失败: %v", err)
	}

	article := models.ArticleModel{
		Title:      "a1",
		Content:    "content",
		CategoryID: &category.ID,
		AuthorID:   user.ID,
		Status:     enum.ArticleStatusPublished,
	}
	if err := db.Create(&article).Error; err != nil {
		t.Fatalf("创建文章失败: %v", err)
	}
	if err := db.Create(&models.ArticleTagModel{ArticleID: article.ID, TagID: tag.ID}).Error; err != nil {
		t.Fatalf("创建文章标签关系失败: %v", err)
	}

	claims := &jwts.MyClaims{Claims: jwts.Claims{UserID: user.ID, Role: enum.RoleUser, Username: user.Username}}

	{
		c, w := newCtx()
		c.Set("claims", claims)
		c.Set("requestUri", models.IDRequest{ID: article.ID})
		api.ArticleDiggView(c)
		if code := readCode(t, w); code != 0 {
			t.Fatalf("点赞失败, code=%d body=%s", code, w.Body.String())
		}
	}

	{
		c, w := newCtx()
		c.Set("claims", claims)
		c.Set("requestJson", ArticleFavoriteRequest{ArticleID: article.ID})
		api.ArticleFavoriteSaveView(c)
		if code := readCode(t, w); code != 0 {
			t.Fatalf("收藏失败, code=%d body=%s", code, w.Body.String())
		}
	}

	token := testutil.IssueAccessToken(t, user)
	{
		c, w := newCtx()
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		req.Header.Set("token", token)
		c.Request = req
		c.Set("requestUri", models.IDRequest{ID: article.ID})
		api.ArticleDetailView(c)
		if code := readCode(t, w); code != 0 {
			t.Fatalf("文章详情失败, code=%d body=%s", code, w.Body.String())
		}
		body := readBody(t, w)
		data := body["data"].(map[string]any)
		if !data["is_digg"].(bool) || !data["is_favor"].(bool) {
			t.Fatalf("文章详情点赞/收藏状态异常, body=%s", w.Body.String())
		}
		if data["author_id"] != article.AuthorID.String() {
			t.Fatalf("文章详情作者 id 异常, body=%s", w.Body.String())
		}
		if data["author_abstract"] != user.Abstract {
			t.Fatalf("文章详情作者简介异常, body=%s", w.Body.String())
		}
		if _, ok := data["author_created_time"].(string); !ok {
			t.Fatalf("文章详情作者创建时间异常, body=%s", w.Body.String())
		}
		if data["category_id"] != category.ID.String() {
			t.Fatalf("文章详情分类 id 异常, body=%s", w.Body.String())
		}
		tagIDs, ok := data["tag_ids"].([]any)
		if !ok || len(tagIDs) != 1 || tagIDs[0] != tag.ID.String() {
			t.Fatalf("文章详情标签 id 列表异常, body=%s", w.Body.String())
		}
		if data["category_name"] != category.Title {
			t.Fatalf("文章详情分类名异常, body=%s", w.Body.String())
		}
	}
	{
		c, w := newCtx()
		c.Set("claims", claims)
		c.Set("requestJson", ArticleFavoriteRequest{ArticleID: article.ID})
		api.ArticleFavoriteSaveView(c)
		if code := readCode(t, w); code != 0 {
			t.Fatalf("取消收藏失败, code=%d body=%s", code, w.Body.String())
		}
	}

	{
		c, w := newCtx()
		req := httptest.NewRequest(http.MethodPost, "/", nil)
		req.Header.Set("token", token)
		c.Request = req
		c.Set("requestJson", ArticleViewCountRequest{ArticleID: article.ID})
		api.ArticleVisitView(c)
		if code := readCode(t, w); code != 0 {
			t.Fatalf("访问计数失败, code=%d body=%s", code, w.Body.String())
		}
	}
	{
		var stat models.UserStatModel
		if err := db.Take(&stat, "user_id = ?", user.ID).Error; err != nil {
			t.Fatalf("查询访问后的作者统计失败: %v", err)
		}
		if stat.ArticleVisitedCount != 1 {
			t.Fatalf("文章访问后作者累计阅读数异常: %+v", stat)
		}
	}
	{
		c, w := newCtx()
		c.Set("claims", claims)
		c.Set("requestUri", models.IDRequest{ID: article.ID})
		api.ArticleDiggView(c)
		if code := readCode(t, w); code != 0 {
			t.Fatalf("取消点赞失败, code=%d body=%s", code, w.Body.String())
		}
	}

	{
		c, w := newCtx()
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		req.Header.Set("token", token)
		c.Request = req
		c.Set("requestUri", models.IDRequest{ID: article.ID})
		api.ArticleDetailView(c)
		if code := readCode(t, w); code != 0 {
			t.Fatalf("文章详情失败, code=%d body=%s", code, w.Body.String())
		}
		body := readBody(t, w)
		data := body["data"].(map[string]any)
		if data["is_digg"].(bool) || data["is_favor"].(bool) {
			t.Fatalf("取消后文章详情点赞/收藏状态异常, body=%s", w.Body.String())
		}
	}

	{
		c, w := newCtx()
		req := httptest.NewRequest(http.MethodDelete, "/", nil)
		req.Header.Set("token", token)
		c.Request = req
		c.Set("claims", claims)
		c.Set("requestUri", models.IDRequest{ID: article.ID})
		api.ArticleRemoveUserView(c)
		if code := readCode(t, w); code != 0 {
			t.Fatalf("用户删除文章失败, code=%d body=%s", code, w.Body.String())
		}
	}
	{
		var stat models.UserStatModel
		if err := db.Take(&stat, "user_id = ?", user.ID).Error; err != nil {
			t.Fatalf("查询删除后的作者统计失败: %v", err)
		}
		if stat.ArticleCount != 0 || stat.ArticleVisitedCount != 0 {
			t.Fatalf("删除文章后作者统计应回退: %+v", stat)
		}
	}
}

func TestArticleAuthorInfoView(t *testing.T) {
	user := setupArticleEnv(t)
	db := testutil.DB()
	api := setupArticleAPI(t)

	if err := db.Model(&models.UserStatModel{}).
		Where("user_id = ?", user.ID).
		Updates(map[string]any{
			"article_count":         3,
			"article_visited_count": 17,
			"fans_count":            8,
		}).Error; err != nil {
		t.Fatalf("更新作者统计失败: %v", err)
	}

	c, w := newCtx()
	c.Set("requestQuery", ArticleAuthorInfoBindRequest{AuthorID: user.ID})
	api.ArticleAuthorInfoView(c)
	if code := readCode(t, w); code != 0 {
		t.Fatalf("查询作者信息失败, code=%d body=%s", code, w.Body.String())
	}

	body := readBody(t, w)
	data := body["data"].(map[string]any)
	if data["author_id"] != user.ID.String() {
		t.Fatalf("作者 id 返回异常: body=%s", w.Body.String())
	}
	if int(data["article_count"].(float64)) != 3 || int(data["article_visited_count"].(float64)) != 17 || int(data["fans_count"].(float64)) != 8 {
		t.Fatalf("作者统计返回异常: body=%s", w.Body.String())
	}
}

func TestArticleAdminVisibilityView(t *testing.T) {
	user := setupArticleEnv(t)
	db := testutil.DB()
	api := setupArticleAPI(t)

	article := models.ArticleModel{
		Title:            "visible article",
		Content:          "content",
		AuthorID:         user.ID,
		Status:           enum.ArticleStatusPublished,
		PublishStatus:    enum.ArticleStatusPublished,
		VisibilityStatus: enum.ArticleVisibilityVisible,
	}
	if err := db.Create(&article).Error; err != nil {
		t.Fatalf("创建文章失败: %v", err)
	}

	{
		c, w := newCtx()
		c.Set("requestUri", ArticleAdminVisibilityURI{ID: article.ID, Visibility: "hide"})
		api.ArticleAdminVisibilityView(c)
		if code := readCode(t, w); code != 0 {
			t.Fatalf("管理员隐藏文章失败, code=%d body=%s", code, w.Body.String())
		}
	}

	if err := db.Take(&article, article.ID).Error; err != nil {
		t.Fatalf("回查隐藏后的文章失败: %v", err)
	}
	if article.EffectiveVisibilityStatus() != enum.ArticleVisibilityAdminHidden {
		t.Fatalf("隐藏后可见性状态异常: %+v", article)
	}

	{
		c, w := newCtx()
		c.Set("requestUri", ArticleAdminVisibilityURI{ID: article.ID, Visibility: "show"})
		api.ArticleAdminVisibilityView(c)
		if code := readCode(t, w); code != 0 {
			t.Fatalf("管理员恢复文章失败, code=%d body=%s", code, w.Body.String())
		}
	}

	if err := db.Take(&article, article.ID).Error; err != nil {
		t.Fatalf("回查恢复后的文章失败: %v", err)
	}
	if article.EffectiveVisibilityStatus() != enum.ArticleVisibilityVisible {
		t.Fatalf("恢复后可见性状态异常: %+v", article)
	}
}
