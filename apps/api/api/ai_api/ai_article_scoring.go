package ai_api

import (
	"myblogx/common/res"
	"myblogx/middleware"
	"myblogx/service/ai_service/ai_scoring"

	"github.com/gin-gonic/gin"
)

// AIArticleScoringView 对整篇文章进行质量评分与写作建议分析。
func (h AIApi) AIArticleScoringView(c *gin.Context) {
	if h.App.RuntimeSite == nil {
		res.FailWithMsg("运行时配置服务未初始化", c)
		return
	}
	cr := middleware.GetBindJson[AIArticleScoringRequest](c)

	data, err := ai_scoring.ScoreArticleQuality(h.App.RuntimeSite.GetRuntimeAI(), ai_scoring.ArticleScoreRequest{
		Title:   cr.Title,
		Content: cr.Content,
	})
	if err != nil {
		res.FailWithMsg(err.Error(), c)
		return
	}

	res.OkWithData(data, c)
}
