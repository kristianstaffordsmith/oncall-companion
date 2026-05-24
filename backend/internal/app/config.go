package app

import "os"

type Config struct {
	Port        string
	DatabaseURL string
	AIProvider  string
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
		AIProvider:  os.Getenv("AI_PROVIDER"),
		OpenAIKey:   os.Getenv("OPENAI_API_KEY"),
	}
}
