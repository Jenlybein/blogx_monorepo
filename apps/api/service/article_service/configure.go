package article_service

import "github.com/sirupsen/logrus"

var articleLogger *logrus.Logger

func Configure(logger *logrus.Logger) {
	articleLogger = logger
}
