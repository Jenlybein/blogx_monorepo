package read_service

import (
	"myblogx/models/ctype"
	"myblogx/service/redis_service"
	"myblogx/service/redis_service/redis_article"
	"myblogx/service/redis_service/redis_comment"
)

type ArticleCounterReader struct {
	Redis redis_service.Deps
}

func NewArticleCounterReader(redisDeps redis_service.Deps) ArticleCounterReader {
	return ArticleCounterReader{
		Redis: redisDeps,
	}
}

func (r ArticleCounterReader) Batch(articleIDs []ctype.ID) redis_article.BatchCounters {
	return redis_article.GetBatchCounters(r.Redis, articleIDs)
}

type CommentCounterReader struct {
	Redis redis_service.Deps
}

func NewCommentCounterReader(redisDeps redis_service.Deps) CommentCounterReader {
	return CommentCounterReader{
		Redis: redisDeps,
	}
}

func (r CommentCounterReader) Batch(commentIDs []ctype.ID) redis_comment.BatchCounters {
	return redis_comment.GetBatchCounters(r.Redis, commentIDs)
}
