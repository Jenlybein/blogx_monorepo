package ipmeta

import "github.com/sirupsen/logrus"

var ipmetaLogger *logrus.Logger

func Configure(logger *logrus.Logger) {
	ipmetaLogger = logger
}
