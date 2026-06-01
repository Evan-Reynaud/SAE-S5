package main

import (
	"backend/config"
	"backend/handlers"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// Charger la config BDD
	config.ConnectDB()

	r := gin.Default()

	// Configurer CORS pour autoriser le Frontend React
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"}, // Port par défaut de Vite
		AllowMethods:     []string{"GET", "POST", "PUT"},
		AllowHeaders:     []string{"Origin", "Content-Type"},
		AllowCredentials: true,
	}))

	// Routes de l'API
	api := r.Group("/api")
	{
		api.GET("/series", handlers.GetAllSeries)
		api.GET("/search", handlers.SearchSeries)
		api.GET("/recommend/:id", handlers.RecommendSeries)
		api.POST("/login", handlers.Login)
		// Ajouter route d'évaluation ici
	}

	// Port dynamique pour Linux/Windows
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	r.Run(":" + port)
}
