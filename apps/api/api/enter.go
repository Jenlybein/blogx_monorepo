// API模块入口

package api

import (
	"myblogx/api/ai_api"
	"myblogx/api/article_api"
	"myblogx/api/banner_api"
	"myblogx/api/captcha_api"
	"myblogx/api/chat_api"
	"myblogx/api/comment_api"
	"myblogx/api/data_api"
	"myblogx/api/follow_api"
	"myblogx/api/global_notif_api"
	"myblogx/api/image_api"
	"myblogx/api/log_api"
	"myblogx/api/search_api"
	"myblogx/api/site_api"
	"myblogx/api/sitemsg_api"
	"myblogx/api/user_api"
	"myblogx/appctx"
)

type Api struct {
	SiteApi         site_api.SiteApi
	LogApi          log_api.LogApi
	ImageApi        image_api.ImageApi
	BannerApi       banner_api.BannerApi
	ImageCaptchaApi captcha_api.ImageCaptchaApi
	UserApi         user_api.UserApi
	ArticleApi      article_api.ArticleApi
	CommentApi      comment_api.CommentApi
	ChatApi         chat_api.ChatApi
	SitemsgApi      sitemsg_api.SitemsgApi
	GlobalNotifApi  global_notif_api.GlobalNotifApi
	FollowApi       follow_api.FollowApi
	SearchApi       search_api.SearchApi
	AIApi           ai_api.AIApi
	DataApi         data_api.DataApi
}

var App = Api{}

func New(ctx *appctx.AppContext) Api {
	return Api{
		SiteApi:         site_api.New(ctx),
		LogApi:          log_api.New(ctx),
		ImageApi:        image_api.New(ctx),
		BannerApi:       banner_api.New(ctx),
		ImageCaptchaApi: captcha_api.New(ctx),
		UserApi:         user_api.New(ctx),
		ArticleApi:      article_api.New(ctx),
		CommentApi:      comment_api.New(ctx),
		ChatApi:         chat_api.New(ctx),
		SitemsgApi:      sitemsg_api.New(ctx),
		GlobalNotifApi:  global_notif_api.New(ctx),
		FollowApi:       follow_api.New(ctx),
		SearchApi:       search_api.New(ctx),
		AIApi:           ai_api.New(ctx),
		DataApi:         data_api.New(ctx),
	}
}
