package cmd

import (
	"library-backend/cmd/migration"
	"log"

	"library-backend/cmd/http"

	"github.com/spf13/cobra"
)

func Start() {
	rootCmd := &cobra.Command{
		Use:   "library-backend",
		Short: "Library Management API",
		Run: func(cmd *cobra.Command, args []string) {
			http.Start()
		},
	}

	migrateCmd := &cobra.Command{
		Use:   "db:migrate",
		Short: "Run DB migration related command",
		Run: func(cmd *cobra.Command, args []string) {
			migration.MigrateDatabase()
		},
	}

	rootCmd.AddCommand(migrateCmd)
	if err := rootCmd.Execute(); err != nil {
		log.Fatal(err)
	}
}
