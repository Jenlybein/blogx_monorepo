package tags

import (
	"myblogx/apideps"
)

type TagsApi struct {
	App apideps.Deps
}

func New(deps apideps.Deps) TagsApi {
	return TagsApi{App: deps}
}
