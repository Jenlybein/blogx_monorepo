package core_test

import (
	"myblogx/appctx"
	"myblogx/conf"
	"myblogx/core"
	"myblogx/test/testutil"
	"testing"
)

func TestInitMySQLESDisabled(t *testing.T) {
	testutil.InitGlobals()
	testutil.SetConfig(&conf.Config{
		River: conf.River{
			Enabled: false,
		},
	})

	core.InitMySQLES(&appctx.AppContext{
		Config: testutil.Config(),
		Logger: testutil.Logger(),
	})
}
