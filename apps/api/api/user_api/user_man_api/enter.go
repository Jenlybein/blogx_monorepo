package user_man_api

import (
	"myblogx/apideps"
)

type UserManApi struct {
	App apideps.Deps
}

func New(deps apideps.Deps) UserManApi {
	return UserManApi{App: deps}
}
