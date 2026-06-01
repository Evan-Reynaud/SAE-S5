package handlers

import (
	"backend/config"
	"backend/models"
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

// GET /series - Liste toutes les séries
func GetAllSeries(c *gin.Context) {
	rows, err := config.DB.Query("SELECT Id_series, nom, img FROM series LIMIT 50")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var seriesList []models.Serie
	for rows.Next() {
		var s models.Serie
		rows.Scan(&s.ID, &s.Nom, &s.Image)
		seriesList = append(seriesList, s)
	}
	c.JSON(http.StatusOK, seriesList)
}

func SearchSeries(c *gin.Context) {
	query := c.Query("q")

	// 1. Découper la phrase en mots (supprime les espaces inutiles)
	words := strings.Fields(query)

	// Si la recherche est vide, on renvoie une liste vide direct
	if len(words) == 0 {
		c.JSON(http.StatusOK, []models.Serie{})
		return
	}

	// 2. Construire la partie dynamique du WHERE (m.label LIKE ? OR m.label LIKE ? ...)
	var whereClauses []string
	var args []interface{}

	for _, word := range words {
		whereClauses = append(whereClauses, "m.label LIKE ?")
		args = append(args, "%"+word+"%")
	}

	// On rejoint les conditions avec "OR" pour trouver les séries qui ont au moins un des mots
	whereString := strings.Join(whereClauses, " OR ")

	// 3. La requête finale
	// Note : J'ai remis titre, resumer, img et le SCORE pour que le tri fonctionne
	sqlStmt := fmt.Sprintf(`
		SELECT s.Id_series, s.nom, s.img
		FROM series s
		JOIN contien c ON s.Id_series = c.Id_series
		JOIN mots m ON c.Id_mots = m.Id_mots
		WHERE %s
		GROUP BY s.Id_series
		LIMIT 20`, whereString)

	// 4. Exécution avec les arguments dynamiques
	rows, err := config.DB.Query(sqlStmt, args...)
	if err != nil {
		fmt.Println("Erreur SQL:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var results []models.Serie
	for rows.Next() {
		var s models.Serie
		// On scanne bien toutes les colonnes pour le frontend
		err := rows.Scan(&s.ID, &s.Nom, &s.Image)
		if err != nil {
			fmt.Println("Erreur Scan:", err)
			continue
		}
		results = append(results, s)
	}

	c.JSON(http.StatusOK, results)
}

// POST /login - Connexion simple
func Login(c *gin.Context) {
	var u models.User
	if err := c.BindJSON(&u); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Données invalides"})
		return
	}
	// Vérification basique (A améliorer pour la sécu en prod)
	var id int
	err := config.DB.QueryRow("SELECT id FROM compte WHERE nom = ? AND mdp = ?", u.Nom, u.Mdp).Scan(&id)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Mauvais identifiants"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Connecté", "userId": id})
}

// GET /recommend/:id - Recommandation basée sur le contenu
// Trouve des séries qui partagent des mots-clés avec la série donnée
func RecommendSeries(c *gin.Context) {
	idSeries := c.Param("id")

	sqlStmt := `
		SELECT DISTINCT s.Id_series, s.titre, s.resumer, s.img
		FROM series s
		JOIN contien c1 ON s.Id_series = c1.Id_series
		WHERE c1.Id_mots IN (
			SELECT Id_mots FROM contien WHERE Id_series = ?
		) AND s.Id_series != ?
		LIMIT 5`

	rows, err := config.DB.Query(sqlStmt, idSeries, idSeries)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var recs []models.Serie
	for rows.Next() {
		var s models.Serie
		rows.Scan(&s.ID, &s.Nom, &s.Image)
		recs = append(recs, s)
	}
	c.JSON(http.StatusOK, recs)
}
