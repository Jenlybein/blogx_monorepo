package data_api

import (
	"myblogx/apideps"
)

type DataApi struct {
	App apideps.Deps
}

func New(deps apideps.Deps) DataApi {
	return DataApi{App: deps}
}
