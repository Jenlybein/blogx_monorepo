package category

import (
	"myblogx/common/res"
	"myblogx/models"
	"myblogx/models/ctype"
	"myblogx/models/enum"
	"myblogx/service/redis_service"
	"myblogx/service/user_service"
	"myblogx/utils/jwts"

	"github.com/gin-gonic/gin"
)

func (h CategoryApi) CategoryOptionsView(c *gin.Context) {
	var list []models.OptionsResponse[ctype.ID]

	token := jwts.GetTokenByGin(c)
	if token != "" {
		authenticator := user_service.NewAuthenticator(
			h.App.DB,
			h.App.Logger,
			h.App.JWT,
			redis_service.Deps{Client: h.App.Redis, Logger: h.App.Logger},
		)
		if authResult, err := authenticator.AuthenticateAccessToken(token); err == nil {
			if err = h.App.DB.Model(&models.CategoryModel{}).
				Where("user_id = ?", authResult.Claims.UserID).
				Order("id asc").
				Select("id as id", "title as title", "title as label", "id as value").
				Scan(&list).Error; err != nil {
				res.FailWithError(err, c)
				return
			}
			res.OkWithData(list, c)
			return
		}
	}

	if err := h.App.DB.Model(&models.CategoryModel{}).
		Joins("JOIN article_models ON article_models.category_id = category_models.id").
		Where("article_models.status = ?", enum.ArticleStatusPublished).
		Distinct().
		Order("category_models.title asc, category_models.id asc").
		Select("category_models.id as id", "category_models.title as title", "category_models.title as label", "category_models.id as value").
		Scan(&list).Error; err != nil {
		res.FailWithError(err, c)
		return
	}

	res.OkWithData(list, c)
}
