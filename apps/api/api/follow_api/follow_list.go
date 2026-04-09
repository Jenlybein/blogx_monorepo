package follow_api

import (
	"myblogx/common/res"
	"myblogx/global"
	"myblogx/middleware"
	"myblogx/models"
	"myblogx/service/follow_service"
	"myblogx/utils/jwts"

	"github.com/gin-gonic/gin"
)

// TODO：增加用户名搜索
// FollowListView 获取关注列表
func (f *FollowApi) FollowListView(c *gin.Context) {
	cr := middleware.GetBindQuery[FollowListRequest](c)

	claims := jwts.GetClaimsByGin(c)

	// 查询目标用户隐私设置，判断是否公开关注列表
	if cr.UserID != claims.UserID {
		if cr.UserID != 0 {
			var user models.UserConfModel
			if err := global.DB.Take(&user, "user_id = ?", cr.UserID).Error; err != nil {
				res.FailWithMsg("用户配置信息不存在", c)
				return
			}
			if !user.FollowVisibility {
				res.FailWithMsg("关注列表不公开", c)
				return
			}
		} else {
			cr.UserID = claims.UserID
		}
	}

	queryService := follow_service.NewQueryService(global.DB)
	list, count, err := queryService.ListFollowing(cr.UserID, claims.UserID, cr.FollowedUserID, cr.PageInfo)
	if err != nil {
		res.FailWithError(err, c)
		return
	}
	res.OkWithList(list, count, c)
}
