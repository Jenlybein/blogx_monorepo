package article_api

import (
	"myblogx/api/article_api/category"
	"myblogx/api/article_api/favorite"
	"myblogx/api/article_api/tags"
	"myblogx/api/article_api/top"
	"myblogx/api/article_api/view_history"
	"myblogx/apideps"
)

type ArticleApi struct {
	App apideps.Deps
	category.CategoryApi
	favorite.FavoriteApi
	top.TopApi
	view_history.ViewHistoryApi
	tags.TagsApi
}

func New(deps apideps.Deps) ArticleApi {
	return ArticleApi{
		App:            deps,
		CategoryApi:    category.New(deps),
		FavoriteApi:    favorite.New(deps),
		TopApi:         top.New(deps),
		ViewHistoryApi: view_history.New(deps),
		TagsApi:        tags.New(deps),
	}
}
