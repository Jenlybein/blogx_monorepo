// 路由模块入口

package router

import (
	"myblogx/api"
	"myblogx/appctx"
	"myblogx/middleware"

	"github.com/gin-gonic/gin"
)

func Run(ctx *appctx.AppContext, app api.Api) {
	gin.SetMode(ctx.Config.System.GinMode)
	r := gin.Default()
	r.Use(middleware.WithAppContext(ctx))
	r.Use(middleware.CorsMiddleware())

	r.Static("/uploads", "./uploads")

	nr := r.Group("/api")
	nr.Use(middleware.LogMiddleware)

	SiteRouter(nr, app)
	LogRouter(nr, app)
	ImageRouter(nr, app)
	BannerRouter(nr, app)
	CaptchaRouter(nr, app)
	UserRouter(nr, app)
	ArticleRouter(nr, app)
	CommentRouter(nr, app)
	ChatRouter(nr, app)
	SitemsgRouter(nr, app)
	GlobalNotifRouter(nr, app)
	FollowRouter(nr, app)
	SearchRouter(nr, app)
	AIRouter(nr, app)
	DataRouter(nr, app)

	addr := ctx.Config.System.Addr()
	r.Run(addr)
}
