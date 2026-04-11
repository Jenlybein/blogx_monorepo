package ai_api

import (
	"myblogx/apideps"
)

type AIApi struct {
	App apideps.Deps
}

func New(deps apideps.Deps) AIApi {
	return AIApi{App: deps}
}
