package chat_api

import (
	"myblogx/apideps"
)

type ChatApi struct {
	App apideps.Deps
}

func New(deps apideps.Deps) ChatApi {
	return ChatApi{App: deps}
}
