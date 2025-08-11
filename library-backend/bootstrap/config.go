package bootstrap

import (
	"fmt"
	"library-backend/internal/config"
	"log"
	"log/slog"
	"os"
	"strconv"
	"time"

	"github.com/spf13/viper"
)

func NewConfig() *config.Config {
	viper.SetConfigType("env")
	viper.SetConfigName(".env")
	viper.AddConfigPath(".")
	viper.AutomaticEnv()

	if err := viper.ReadInConfig(); err != nil {
		slog.Warn("Error reading config file", "error", err)
	}

	err := viper.ReadInConfig() // Find and read the config file
	if err != nil {             // Handle errors reading the config file
		slog.Warn("error reading config file", "error", err)
	}

	cfg := config.Config{
		AppPort:       viper.GetString("APP_PORT"),
		AppName:       viper.GetString("APP_NAME"),
		DBURL:         getRequiredString("DB_URL"),
		DBMaxIdleConn: getEnvAsInt("DB_MAX_IDLE_CONN", 10),
		DBMaxOpenConn: getEnvAsInt("DB_MAX_OPEN_CONN", 10),
	}

	return &cfg
}

func getRequiredString(key string) string {
	if viper.IsSet(key) {
		return viper.GetString(key)
	}

	log.Fatalln(fmt.Errorf("KEY %s IS MISSING", key))
	return ""
}

func getRequiredInt(key string) int {
	if viper.IsSet(key) {
		return viper.GetInt(key)
	}

	panic(fmt.Errorf("KEY %s IS MISSING", key))
}

func getRequiredTime(key string) time.Duration {
	if viper.IsSet(key) {
		return time.Duration(viper.GetInt(key)) * time.Second
	}

	panic(fmt.Errorf("KEY %s IS MISSING", key))
}

func getRequiredBool(key string) bool {
	if viper.IsSet(key) {
		return viper.GetBool(key)
	}

	panic(fmt.Errorf("KEY %s IS MISSING", key))
}

func GetEnv(key string, defaultVal string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}

	return defaultVal
}

func getEnvAsInt(name string, defaultVal int) int {
	valStr := GetEnv(name, "")
	if value, err := strconv.Atoi(valStr); err == nil {
		return value
	}

	return defaultVal
}
