package models

import "strings"

var articleESIndex = "article_index"

func Configure(esIndex string) {
	esIndex = strings.TrimSpace(esIndex)
	if esIndex == "" {
		return
	}
	articleESIndex = esIndex
}
