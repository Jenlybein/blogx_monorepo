package site_service

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"sync"

	"myblogx/conf"
	siteconf "myblogx/conf/site"
	"myblogx/models"
	"myblogx/utils/envyaml"

	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

const runtimeConfigName = "default"

type RuntimeConfig struct {
	Site conf.Site `json:"site"`
	AI   conf.AI   `json:"ai"`
}

var runtimeConfigCache struct {
	mu   sync.RWMutex
	data *RuntimeConfig
}

var runtimeDeps struct {
	mu            sync.RWMutex
	baseSite      conf.Site
	baseAI        conf.AI
	applyBaseFunc func(site conf.Site, ai conf.AI)
	logger        *logrus.Logger
	db            *gorm.DB
	configFile    string
}

func ConfigureRuntimeConfig(baseSite conf.Site, baseAI conf.AI, applyBaseFunc func(site conf.Site, ai conf.AI), logger *logrus.Logger, db *gorm.DB, configFile string) {
	runtimeDeps.mu.Lock()
	defer runtimeDeps.mu.Unlock()
	runtimeDeps.baseSite = baseSite
	runtimeDeps.baseAI = baseAI
	runtimeDeps.applyBaseFunc = applyBaseFunc
	runtimeDeps.logger = logger
	runtimeDeps.db = db
	runtimeDeps.configFile = configFile
}

func runtimeBaseConfig() RuntimeConfig {
	runtimeDeps.mu.RLock()
	defer runtimeDeps.mu.RUnlock()
	return RuntimeConfig{
		Site: runtimeDeps.baseSite,
		AI:   runtimeDeps.baseAI,
	}
}

func runtimeApplyBase(site conf.Site, ai conf.AI) {
	runtimeDeps.mu.RLock()
	apply := runtimeDeps.applyBaseFunc
	runtimeDeps.mu.RUnlock()
	if apply != nil {
		apply(site, ai)
	}
}

func runtimeLogger() *logrus.Logger {
	runtimeDeps.mu.RLock()
	defer runtimeDeps.mu.RUnlock()
	return runtimeDeps.logger
}

func runtimeDB() *gorm.DB {
	runtimeDeps.mu.RLock()
	defer runtimeDeps.mu.RUnlock()
	return runtimeDeps.db
}

func runtimeConfigFile() string {
	runtimeDeps.mu.RLock()
	defer runtimeDeps.mu.RUnlock()
	return runtimeDeps.configFile
}

func defaultRuntimeConfig() *RuntimeConfig {
	baseConfig := runtimeBaseConfig()
	return &RuntimeConfig{
		Site: baseConfig.Site,
		AI:   baseConfig.AI,
	}
}

func loadRuntimeDefaultConfigFromFile() (*RuntimeConfig, error) {
	configFile := runtimeConfigFile()
	if configFile == "" {
		return nil, errors.New("运行时站点默认配置路径未设置")
	}
	defaultFile := filepath.Join(filepath.Dir(configFile), "site_default_settings.yaml")
	byteData, err := os.ReadFile(defaultFile)
	if err != nil {
		return nil, err
	}

	var raw conf.RuntimeSiteDefault
	if err = envyaml.Unmarshal(byteData, &raw); err != nil {
		return nil, fmt.Errorf("解析运行时站点默认配置失败: %w", err)
	}
	return &RuntimeConfig{
		Site: raw.Site,
		AI:   raw.AI,
	}, nil
}

func initialRuntimeConfig() *RuntimeConfig {
	cfg, err := loadRuntimeDefaultConfigFromFile()
	if err == nil {
		return cfg
	}
	if logger := runtimeLogger(); logger != nil {
		logger.Warnf("读取 site_default_settings.yaml 失败，回退到进程内默认值: %v", err)
	}
	return defaultRuntimeConfig()
}

func cloneRuntimeConfig(cfg *RuntimeConfig) *RuntimeConfig {
	if cfg == nil {
		return &RuntimeConfig{}
	}
	cp := *cfg
	return &cp
}

func setRuntimeConfigCache(cfg *RuntimeConfig) {
	runtimeConfigCache.mu.Lock()
	defer runtimeConfigCache.mu.Unlock()
	runtimeConfigCache.data = cloneRuntimeConfig(cfg)
}

func GetRuntimeConfig() RuntimeConfig {
	runtimeConfigCache.mu.RLock()
	if runtimeConfigCache.data != nil {
		cfg := *runtimeConfigCache.data
		runtimeConfigCache.mu.RUnlock()
		return cfg
	}
	runtimeConfigCache.mu.RUnlock()

	cfg := defaultRuntimeConfig()
	return *cfg
}

func GetRuntimeSite() conf.Site {
	return GetRuntimeConfig().Site
}

func GetRuntimeLogin() siteconf.Login {
	return GetRuntimeSite().Login
}

func GetRuntimeArticle() siteconf.Article {
	return GetRuntimeSite().Article
}

func GetRuntimeComment() siteconf.Comment {
	return GetRuntimeSite().Comment
}

func GetRuntimeAI() conf.AI {
	return GetRuntimeConfig().AI
}

func applyRuntimeConfig(cfg *RuntimeConfig) {
	if cfg != nil {
		runtimeApplyBase(cfg.Site, cfg.AI)
	}
	setRuntimeConfigCache(cfg)
}

func marshalRuntimeConfig(cfg *RuntimeConfig) (siteJSON string, aiJSON string, err error) {
	siteData, err := json.Marshal(cfg.Site)
	if err != nil {
		return "", "", fmt.Errorf("序列化站点配置失败: %w", err)
	}
	aiData, err := json.Marshal(cfg.AI)
	if err != nil {
		return "", "", fmt.Errorf("序列化 AI 配置失败: %w", err)
	}
	return string(siteData), string(aiData), nil
}

func decodeRuntimeConfig(model *models.RuntimeSiteConfigModel) (*RuntimeConfig, error) {
	cfg := defaultRuntimeConfig()
	if model == nil {
		return cfg, nil
	}
	if model.SiteJSON != "" {
		if err := json.Unmarshal([]byte(model.SiteJSON), &cfg.Site); err != nil {
			return nil, fmt.Errorf("解析站点配置失败: %w", err)
		}
	}
	if model.AIJSON != "" {
		if err := json.Unmarshal([]byte(model.AIJSON), &cfg.AI); err != nil {
			return nil, fmt.Errorf("解析 AI 配置失败: %w", err)
		}
	}
	return cfg, nil
}

func ensureRuntimeConfigModel(tx *gorm.DB) (*models.RuntimeSiteConfigModel, *RuntimeConfig, error) {
	var model models.RuntimeSiteConfigModel
	err := tx.Where("name = ?", runtimeConfigName).Take(&model).Error
	switch {
	case errors.Is(err, gorm.ErrRecordNotFound):
		cfg := initialRuntimeConfig()
		siteJSON, aiJSON, marshalErr := marshalRuntimeConfig(cfg)
		if marshalErr != nil {
			return nil, nil, marshalErr
		}
		model = models.RuntimeSiteConfigModel{
			Name:     runtimeConfigName,
			SiteJSON: siteJSON,
			AIJSON:   aiJSON,
		}
		if createErr := tx.Create(&model).Error; createErr != nil {
			return nil, nil, createErr
		}
		return &model, cfg, nil
	case err != nil:
		return nil, nil, err
	default:
		cfg, decodeErr := decodeRuntimeConfig(&model)
		if decodeErr != nil {
			return nil, nil, decodeErr
		}
		return &model, cfg, nil
	}
}

// InitRuntimeConfig 会在启动时把运行时站点配置从数据库加载到内存。
// 当数据库还没有初始化记录时，会使用 site_default_settings.yaml 中的默认值灌入数据库。
func InitRuntimeConfig() error {
	db := runtimeDB()
	if db == nil {
		return errors.New("数据库未初始化")
	}
	if !db.Migrator().HasTable(&models.RuntimeSiteConfigModel{}) {
		return errors.New("运行时配置表不存在，请先执行数据库初始化命令：/app/server -db")
	}
	var loaded *RuntimeConfig
	if err := db.Transaction(func(tx *gorm.DB) error {
		_, cfg, err := ensureRuntimeConfigModel(tx)
		if err != nil {
			return err
		}
		loaded = cfg
		return nil
	}); err != nil {
		return err
	}
	applyRuntimeConfig(loaded)
	return nil
}

func UpdateRuntimeSite(site conf.Site) error {
	db := runtimeDB()
	if db == nil {
		return errors.New("数据库未初始化")
	}
	var updated *RuntimeConfig
	if err := db.Transaction(func(tx *gorm.DB) error {
		model, cfg, err := ensureRuntimeConfigModel(tx)
		if err != nil {
			return err
		}
		cfg.Site = site
		siteJSON, aiJSON, marshalErr := marshalRuntimeConfig(cfg)
		if marshalErr != nil {
			return marshalErr
		}
		if err = tx.Model(model).Updates(map[string]any{
			"site_json": siteJSON,
			"ai_json":   aiJSON,
		}).Error; err != nil {
			return err
		}
		updated = cfg
		return nil
	}); err != nil {
		return err
	}
	applyRuntimeConfig(updated)
	return nil
}

func UpdateRuntimeAI(ai conf.AI) error {
	db := runtimeDB()
	if db == nil {
		return errors.New("数据库未初始化")
	}
	var updated *RuntimeConfig
	if err := db.Transaction(func(tx *gorm.DB) error {
		model, cfg, err := ensureRuntimeConfigModel(tx)
		if err != nil {
			return err
		}
		cfg.AI = ai
		siteJSON, aiJSON, marshalErr := marshalRuntimeConfig(cfg)
		if marshalErr != nil {
			return marshalErr
		}
		if err = tx.Model(model).Updates(map[string]any{
			"site_json": siteJSON,
			"ai_json":   aiJSON,
		}).Error; err != nil {
			return err
		}
		updated = cfg
		return nil
	}); err != nil {
		return err
	}
	applyRuntimeConfig(updated)
	return nil
}
