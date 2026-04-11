package favorite

import (
	"myblogx/apideps"
)

type FavoriteApi struct {
	App apideps.Deps
}

func New(deps apideps.Deps) FavoriteApi {
	return FavoriteApi{App: deps}
}
