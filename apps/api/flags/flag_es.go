package flags

import (
	"fmt"
	"myblogx/models"
	"myblogx/models/ctype"
	"myblogx/service/es_service"

	"gorm.io/gorm"
)

func FlagESIndex() {
	// 初始化ES索引
	article := models.ArticleModel{}
	index := article.Index()

	fmt.Println("请输入索引设置: ")
	fmt.Println("1. 初始化文章索引设置")
	fmt.Println("2. 删除文章索引设置")

	var indexChoice int
	fmt.Scanln(&indexChoice)

	switch indexChoice {
	case 1:
		// 初始化文章索引设置
		if err := es_service.CreateIndexForce(index, article.Mapping()); err != nil {
			flagLogger.Errorf("初始化索引失败: %v", err)
			return
		}
		flagLogger.Infof("索引 %s 初始化成功", index)
	case 2:
		// 删除文章索引设置
		if err := es_service.DeleteIndex(index); err != nil {
			flagLogger.Errorf("删除索引失败: %v", err)
			return
		}
		flagLogger.Infof("索引 %s 删除成功", index)
	default:
		fmt.Println("无效的选择，不执行任何操作")
	}

	// 初始化 ES 流水线
	pipelineName := article.PipelineName()

	fmt.Println("请输入流水线设置: ")
	fmt.Println("1. 初始化文章流水线设置")
	fmt.Println("2. 删除文章流水线设置")

	var pipelineChoice int
	fmt.Scanln(&pipelineChoice)

	switch pipelineChoice {
	case 1:
		// 初始化文章流水线设置
		if err := es_service.CreatePipelineForce(pipelineName, article.Pipeline()); err != nil {
			flagLogger.Errorf("初始化流水线失败: %v", err)
			return
		}
		flagLogger.Infof("流水线 %s 初始化成功", pipelineName)
	case 2:
		// 删除文章流水线设置
		if err := es_service.DeletePipeline(pipelineName); err != nil {
			flagLogger.Errorf("删除流水线失败: %v", err)
			return
		}
		flagLogger.Infof("流水线 %s 删除成功", pipelineName)
	default:
		fmt.Println("无效的选择，不执行任何操作")
	}
}

// FlagESEnsure 非交互地确保 ES 索引和流水线存在。
// 这个模式用于容器首启初始化：缺失则创建，已存在则跳过，不会删除已有索引。
func FlagESEnsure() {
	article := models.ArticleModel{}
	index := article.Index()
	pipelineName := article.PipelineName()

	if err := es_service.EnsureIndex(index, article.Mapping()); err != nil {
		flagLogger.Errorf("确保索引失败: %v", err)
		return
	}
	flagLogger.Infof("索引 %s 已就绪", index)

	if err := es_service.EnsurePipeline(pipelineName, article.Pipeline()); err != nil {
		flagLogger.Errorf("确保流水线失败: %v", err)
		return
	}
	flagLogger.Infof("流水线 %s 已就绪", pipelineName)
}

// FlagESArticleSync 全量同步文章数据到 ES。
func FlagESArticleSync() {
	if flagDB == nil {
		flagLogger.Error("文章同步失败: 数据库未初始化")
		return
	}
	if flagES == nil {
		flagLogger.Error("文章同步失败: ES 客户端未初始化")
		return
	}

	article := models.ArticleModel{}
	index := article.Index()

	// 检查 ES 索引是否存在
	exists, err := es_service.ExistsIndex(index)
	if err != nil {
		flagLogger.Errorf("文章同步失败: 检查 ES 索引失败: %v", err)
		return
	}
	if !exists {
		flagLogger.Errorf("文章同步失败: ES 索引 %s 不存在，请先执行 -es -s init", index)
		return
	}

	// 设置同步批次
	batchSize := 128
	if flagRiverConfig.BulkSize > 0 {
		batchSize = flagRiverConfig.BulkSize
	}

	total, err := syncArticleDocuments(flagDB, index, batchSize)
	if err != nil {
		flagLogger.Errorf("文章同步失败: %v", err)
		return
	}
	flagLogger.Infof("文章同步完成，共同步 %d 篇文章到索引 %s", total, index)
}

// syncArticleDocuments 全量同步文章数据到 ES
func syncArticleDocuments(db *gorm.DB, index string, batchSize int) (int, error) {
	articles := make([]models.ArticleModel, 0, batchSize)
	total := 0

	result := db.Model(&models.ArticleModel{}).
		Select("id").
		Order("id asc").
		FindInBatches(&articles, batchSize, func(tx *gorm.DB, batch int) error {
			articleIDs := make([]ctype.ID, 0, len(articles))
			for _, article := range articles {
				articleIDs = append(articleIDs, article.ID)
			}

			if len(articleIDs) == 0 {
				return nil
			}

			if err := es_service.SyncESDocs(articleIDs); err != nil {
				return fmt.Errorf("第 %d 批文章同步到 ES 失败: %w", batch, err)
			}

			total += len(articles)
			flagLogger.Infof("文章同步进度: 第 %d 批完成，本批 %d 篇，累计 %d 篇", batch, len(articles), total)
			return nil
		})
	if result.Error != nil {
		return total, result.Error
	}
	return total, nil
}

func buildArticleESDocument(article models.ArticleModel, adminTop, authorTop bool) map[string]any {
	return es_service.BuildArticleESDocument(article, adminTop, authorTop)
}
