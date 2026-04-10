package global

// Package global 已废弃。
//
// 历史上这里承载过 DB/Redis/Config/Logger/ES 等全局单例，
// 现在已迁移到显式依赖注入（AppContext + 构造器参数）链路。
//
// 该包仅保留空壳用于兼容旧路径，禁止再新增任何运行时业务依赖。
