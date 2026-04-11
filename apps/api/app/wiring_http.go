package app

import (
	"myblogx/api"
	"myblogx/apideps"
	"myblogx/router"

	"github.com/mojocn/base64Captcha"
)

// WireHTTP 集中组装 HTTP handler 与 router。
func WireHTTP(infra *Infra) error {
	if err := validateInfra(infra); err != nil {
		return err
	}

	cfg := infra.Config
	deps := apideps.Deps{
		Version:           infra.Version,
		ConfigFile:        infra.ConfigFile,
		System:            cfg.System,
		JWT:               cfg.Jwt,
		Log:               cfg.Log,
		ClickHouseConfig:  cfg.ClickHouse,
		ES:                cfg.ES,
		QQ:                cfg.QQ,
		Email:             cfg.Email,
		QiNiu:             cfg.QiNiu,
		Upload:            cfg.Upload,
		Logger:            infra.Logger,
		DB:                infra.DB,
		Redis:             infra.Redis,
		ClickHouse:        infra.ClickHouse,
		ESClient:          infra.ESClient,
		RuntimeSite:       infra.RuntimeSite,
		ImageCaptchaStore: base64Captcha.DefaultMemStore,
	}

	router.Run(deps, api.New(deps))
	return nil
}
