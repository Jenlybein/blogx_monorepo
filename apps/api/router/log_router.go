package router

import (
	"myblogx/api"
	"myblogx/api/log_api"
	mw "myblogx/middleware"
	"myblogx/models"

	"github.com/gin-gonic/gin"
)

func LogRouter(r *gin.RouterGroup, appContainer api.Api, runtimeMw mw.Runtime) {
	group := r.Group("logs")
	group.Use(runtimeMw.AuthMiddleware, mw.AdminMiddleware)

	app := appContainer.LogApi

	group.GET("runtime", mw.BindQuery[log_api.RuntimeLogListRequest], app.RuntimeLogListView)
	group.GET("runtime/:id", mw.BindUri[models.IDRequest], app.RuntimeLogDetailView)

	group.GET("login", mw.BindQuery[log_api.LoginLogListRequest], app.LoginLogListView)
	group.GET("login/:id", mw.BindUri[models.IDRequest], app.LoginLogDetailView)

	group.GET("action", mw.BindQuery[log_api.ActionAuditListRequest], app.ActionAuditListView)
	group.GET("action/:id", mw.BindUri[models.IDRequest], app.ActionAuditDetailView)
}
