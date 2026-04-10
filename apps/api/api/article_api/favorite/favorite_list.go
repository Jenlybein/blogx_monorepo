package favorite

import (
	"myblogx/common/res"
	"myblogx/middleware"
	"myblogx/models"
	"myblogx/models/ctype"
	"myblogx/service/favorite_service"
	"myblogx/service/user_service"
	"myblogx/utils/jwts"

	"github.com/gin-gonic/gin"
)

// 查询收藏夹列表
func (FavoriteApi) FavoriteListView(c *gin.Context) {
	cr := middleware.GetBindQuery[FavoriteListRequest](c)

	var claim *jwts.MyClaims
	var err error
	if authResult := user_service.MustAuthenticateAccessTokenByGin(c); authResult != nil {
		claim = authResult.Claims
	} else {
		err = user_service.ErrAuthRequired
	}

	switch cr.Type {
	case 1:
		if err != nil {
			res.FailWithError(err, c)
			return
		}
		cr.UserID = claim.UserID
	case 2:
		if cr.UserID == 0 {
			res.FailWithMsg("用户 id 不能为空", c)
			return
		}
		// 查询目标用户隐私设置，判断是否公开收藏夹
		var userConf models.UserConfModel
		if err := mustApp(c).DB.Take(&userConf, "user_id = ?", cr.UserID).Error; err != nil {
			res.FailWithMsg("用户不存在", c)
			return
		}
		if !userConf.FavoritesVisibility {
			res.FailWithMsg("收藏夹不公开", c)
			return
		}
	case 3:
		if err != nil || claim.IsAdmin() == false {
			res.FailWithMsg("权限不足", c)
			return
		}
	}

	viewerUserID := ctype.ID(0)
	if claim != nil {
		viewerUserID = claim.UserID
	}
	queryService := favorite_service.NewQueryService(mustApp(c).DB)
	list, count, err := queryService.ListFavorites(favorite_service.FavoriteListQuery{
		PageInfo:  cr.PageInfo,
		UserID:    cr.UserID,
		ViewerID:  viewerUserID,
		ArticleID: cr.ArticleID,
		Type:      cr.Type,
	})
	if err != nil {
		res.FailWithError(err, c)
		return
	}

	res.OkWithList(list, count, c)
}
