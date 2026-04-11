package follow_api

import (
	"myblogx/apideps"
)

type FollowApi struct {
	App apideps.Deps
}

func New(deps apideps.Deps) FollowApi {
	return FollowApi{App: deps}
}
