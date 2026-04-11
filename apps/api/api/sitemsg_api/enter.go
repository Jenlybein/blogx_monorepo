package sitemsg_api

import (
	"myblogx/apideps"
)

type SitemsgApi struct {
	App apideps.Deps
}

func New(deps apideps.Deps) SitemsgApi {
	return SitemsgApi{App: deps}
}
