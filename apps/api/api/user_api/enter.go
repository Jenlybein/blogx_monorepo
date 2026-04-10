package user_api

import (
	"myblogx/api/user_api/auth_api"
	"myblogx/api/user_api/log_api"
	"myblogx/api/user_api/profile_api"
	"myblogx/api/user_api/user_man_api"
	"myblogx/appctx"
)

type UserApi struct {
	ProfileApi profile_api.ProfileApi
	AuthApi    auth_api.AuthApi
	LogApi     log_api.LogApi
	UserManApi user_man_api.UserManApi
}

func New(ctx *appctx.AppContext) UserApi {
	return UserApi{
		ProfileApi: profile_api.New(ctx),
		AuthApi:    auth_api.New(ctx),
		LogApi:     log_api.New(ctx),
		UserManApi: user_man_api.New(ctx),
	}
}
