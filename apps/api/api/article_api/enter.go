package article_api

import (
	"myblogx/api/article_api/category"
	"myblogx/api/article_api/favorite"
	"myblogx/api/article_api/tags"
	"myblogx/api/article_api/top"
	"myblogx/api/article_api/view_history"
	"myblogx/appctx"
)

type ArticleApi struct {
	category.CategoryApi
	favorite.FavoriteApi
	top.TopApi
	view_history.ViewHistoryApi
	tags.TagsApi
}

func New(ctx *appctx.AppContext) ArticleApi {
	return ArticleApi{
		CategoryApi:    category.New(ctx),
		FavoriteApi:    favorite.New(ctx),
		TopApi:         top.New(ctx),
		ViewHistoryApi: view_history.New(ctx),
		TagsApi:        tags.New(ctx),
	}
}
