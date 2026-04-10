package router_test

import (
	api2 "myblogx/api"
	"myblogx/router"
	"testing"

	"github.com/gin-gonic/gin"
)

func TestRegisterAllRoutes(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	api := r.Group("/api")
	app := api2.New(nil)

	router.SiteRouter(api, app)
	router.LogRouter(api, app)
	router.ImageRouter(api, app)
	router.BannerRouter(api, app)
	router.CaptchaRouter(api, app)
	router.UserRouter(api, app)
	router.ArticleRouter(api, app)
	router.SearchRouter(api, app)
	router.SitemsgRouter(api, app)
	router.GlobalNotifRouter(api, app)

	routes := r.Routes()
	if len(routes) == 0 {
		t.Fatal("路由不应为空")
	}

	routeSet := make(map[string]bool)
	for _, rt := range routes {
		routeSet[rt.Method+" "+rt.Path] = true
	}

	expect := []string{
		"GET /api/site/qq_url",
		"GET /api/site/:name",
		"GET /api/imagecaptcha",
		"GET /api/logs/runtime",
		"GET /api/logs/login",
		"GET /api/logs/action",
		"POST /api/images/upload-tasks",
		"POST /api/images/upload-tasks/complete",
		"POST /api/images/qiniu/callback",
		"GET /api/banners",
		"POST /api/users/login",
		"GET /api/search/articles",
		"GET /api/sitemsg",
		"GET /api/global_notif",
		"POST /api/global_notif/read",
		"DELETE /api/global_notif/user",
		"POST /api/global_notif",
		"DELETE /api/global_notif",
	}
	for _, e := range expect {
		if !routeSet[e] {
			t.Fatalf("缺少路由: %s", e)
		}
	}
}
