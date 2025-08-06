package config

type Config struct {
	AppPort       string `mapstructure:"APP_PORT" default:"3000"`
	AppName       string `mapstructure:"APP_NAME" default:"library-service"`
	DBURL         string `mapstructure:"DB_URL" default:"postgres://postgres:postgres@localhost:5432/library"`
	DBMaxIdleConn int    `mapstructure:"DB_MAX_IDLE_CONN" default:"10"`
	DBMaxOpenConn int    `mapstructure:"DB_MAX_OPEN_CONN" default:"100"`
}
