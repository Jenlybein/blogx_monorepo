package category

import (
	"myblogx/apideps"
)

type CategoryApi struct {
	App apideps.Deps
}

func New(deps apideps.Deps) CategoryApi {
	return CategoryApi{App: deps}
}
