package view_history

import (
	"myblogx/apideps"
)

type ViewHistoryApi struct {
	App apideps.Deps
}

func New(deps apideps.Deps) ViewHistoryApi {
	return ViewHistoryApi{App: deps}
}
