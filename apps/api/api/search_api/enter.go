package search_api

import (
	"myblogx/apideps"
)

type SearchApi struct {
	App apideps.Deps
}

func New(deps apideps.Deps) SearchApi {
	return SearchApi{App: deps}
}
