package image_api

import (
	"myblogx/apideps"
)

type ImageApi struct {
	App apideps.Deps
}

func New(deps apideps.Deps) ImageApi {
	return ImageApi{App: deps}
}
