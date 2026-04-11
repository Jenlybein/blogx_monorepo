package comment_api

import (
	"myblogx/apideps"
)

type CommentApi struct {
	App apideps.Deps
}

func New(deps apideps.Deps) CommentApi {
	return CommentApi{App: deps}
}
