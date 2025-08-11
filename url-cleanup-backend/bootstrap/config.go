package bootstrap

import (
	"log/slog"
	"url-cleanup-backend/internal/config"

	"github.com/spf13/viper"
)

func NewConfig() *config.Config {
	viper.SetConfigType("env")
	viper.SetConfigName(".env")
	viper.AddConfigPath(".")
	viper.AutomaticEnv()

	if err := viper.ReadInConfig(); err != nil {
		slog.Warn("Error reading config file: %v", err)
	}

	var config config.Config
	if err := viper.Unmarshal(&config); err != nil {
		slog.Warn("Unable to decode config: %v", err)
	}

	return &config
}
