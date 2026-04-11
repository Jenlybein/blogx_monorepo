package top

import (
	"myblogx/apideps"
)

type TopApi struct {
	App apideps.Deps
}

func New(deps apideps.Deps) TopApi {
	return TopApi{App: deps}
}
