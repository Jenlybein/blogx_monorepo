package log_api

import (
	"myblogx/apideps"
)

type LogApi struct {
	App apideps.Deps
}

func New(deps apideps.Deps) LogApi {
	return LogApi{App: deps}
}
