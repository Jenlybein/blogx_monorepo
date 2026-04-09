package read_service

import (
	"myblogx/models/ctype"
	"myblogx/service/redis_service/redis_article"
	"myblogx/service/redis_service/redis_comment"
)

type ArticleCounterReader struct{}

func NewArticleCounterReader() ArticleCounterReader {
	return ArticleCounterReader{}
}

func (ArticleCounterReader) Batch(articleIDs []ctype.ID) redis_article.BatchCounters {
	return redis_article.GetBatchCounters(articleIDs)
}

type CommentCounterReader struct{}

func NewCommentCounterReader() CommentCounterReader {
	return CommentCounterReader{}
}

func (CommentCounterReader) Batch(commentIDs []ctype.ID) redis_comment.BatchCounters {
	return redis_comment.GetBatchCounters(commentIDs)
}
