package auth_api

import (
	"myblogx/apideps"
)

type AuthApi struct {
	App apideps.Deps
}

func New(deps apideps.Deps) AuthApi {
	return AuthApi{App: deps}
}
