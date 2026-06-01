package models

type Serie struct {
	ID      int     `json:"id" db:"Id_series"`
	Nom     string  `json:"nom" db:"nom"`
	Summary string  `json:"summary"`         // "resumer" dans ta BDD ? Adapté selon ta colonne
	Score   float64 `json:"score,omitempty"` // Pour le tri par pertinence
	Image   string  `json:"image"`           // URL de l'image
}

type User struct {
	ID  int    `json:"id"`
	Nom string `json:"nom"`
	Mdp int    `json:"mdp"` // Attention: INT selon ton SQL
}

type Evaluation struct {
	UserID   int `json:"user_id"`
	SeriesID int `json:"series_id"`
	Note     int `json:"note"`
}
