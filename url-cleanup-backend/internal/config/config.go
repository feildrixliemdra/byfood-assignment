package config

type Config struct {
	AppPort string `mapstructure:"APP_PORT" default:"3000"`
	AppName string `mapstructure:"APP_NAME" default:"url-cleanup-service"`
}
