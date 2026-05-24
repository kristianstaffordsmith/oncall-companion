package app

import "os"

type Config struct {
	Port        string
	DatabaseURL string
	OpenAIKey   string
}

func LoadConfig() Config {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	return Config{
		Port:        port,
		DatabaseURL: os.Getenv("DATABASE_URL"),
		OpenAIKey:   os.Getenv("OPENAI_API_KEY"),
	}
}
