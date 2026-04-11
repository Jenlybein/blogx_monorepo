package profile_api

import (
	"myblogx/apideps"
)

type ProfileApi struct {
	App apideps.Deps
}

func New(deps apideps.Deps) ProfileApi {
	return ProfileApi{App: deps}
}
