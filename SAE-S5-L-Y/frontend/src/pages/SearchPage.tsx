import { useState, useEffect } from 'react';
import axios from 'axios';
import { type Serie } from '../types';

export default function SearchPage() {
    const [query, setQuery] = useState("");
    const [series, setSeries] = useState<Serie[]>([]);
    const [loading, setLoading] = useState(false);

    // Chargement initial
    useEffect(() => {
        fetchSeries();
    }, []);

    const fetchSeries = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/series');
            console.log("🌐 API (Init) - Données reçues :", res.data);
            setSeries(res.data || []);
        } catch (err) {
            console.error("❌ Erreur API (Init) :", err);
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query) return fetchSeries();

        setLoading(true);
        try {
            const url = `http://localhost:8080/api/search?q=${query}`;
            console.log("🔍 Envoi de la requête vers :", url);
            const res = await axios.get(url);
            console.log("✅ API (Recherche) - Résultat :", res.data);
            setSeries(res.data || []);
        } catch (err) {
            console.error("❌ Erreur API (Recherche)", err);
        }
        setLoading(false);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
                Moteur de recherche de Séries
            </h1>

            {/* Formulaire de recherche */}
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Rechercher un mot dans les dialogues..."
                    className="w-full sm:w-96 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow-md transition duration-200 ease-in-out transform hover:scale-105"
                >
                    Rechercher
                </button>
            </form>

            {/* État de chargement et Grille de résultats */}
            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {series.map((s) => (
                        <div key={s.id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
                            {/* Image */}
                            <div className="relative h-64 w-full overflow-hidden">
                                <img
                                    src={s.image || "https://via.placeholder.com/300x450?text=No+Image"}
                                    alt={s.nom}
                                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                                />
                            </div>

                            {/* Contenu de la carte */}
                            <div className="p-4 flex flex-col flex-grow">
                                <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">
                                    {s.nom}
                                </h3>

                                {s.score && (
                                    <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded mb-4 w-fit">
                                        Pertinence: {s.score.toFixed(2)}
                                    </span>
                                )}

                                {/* Le bouton est poussé vers le bas grâce au margin-top auto */}
                                <button
                                    onClick={() => alert(`ID Recommandation: ${s.id}`)}
                                    className="mt-auto w-full py-2 px-4 border border-blue-600 text-blue-600 font-semibold rounded hover:bg-blue-50 transition-colors"
                                >
                                    Voir recommandations
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Message si aucun résultat */}
            {!loading && series.length === 0 && (
                <p className="text-center text-gray-500 mt-10">Aucune série trouvée.</p>
            )}
        </div>
    );
}