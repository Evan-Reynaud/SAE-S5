package config

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/go-sql-driver/mysql"
)

var DB *sql.DB

func ConnectDB() {
	// Utilisation de variables d'environnement pour switcher Windows/Linux facilement
	dbUser := os.Getenv("DB_USER")
	dbPass := os.Getenv("DB_PASS")
	dbHost := os.Getenv("DB_HOST")
	dbName := "Sae"

	dsn := fmt.Sprintf("%s:%s@tcp(%s:3306)/%s", dbUser, dbPass, dbHost, dbName)

	var err error
	DB, err = sql.Open("mysql", dsn)
	if err != nil {
		log.Fatal("Erreur de connexion BDD:", err)
	}

	if err = DB.Ping(); err != nil {
		log.Fatal("La BDD ne répond pas:", err)
	}
	fmt.Println("Connecté à la base de données MySQL")
}
