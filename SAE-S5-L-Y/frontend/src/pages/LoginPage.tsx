import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
    setUser: (user: any) => void;
}

export default function LoginPage({ setUser }: LoginProps) {
    const [nom, setNom] = useState("");
    const [mdp, setMdp] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(""); // Réinitialiser l'erreur

        try {
            // Attention: mdp est un INT dans ta BDD, on le convertit donc en nombre
            // Si le backend attend un int, assure-toi d'envoyer un nombre.
            const response = await axios.post('http://localhost:8080/api/login', {
                nom: nom,
                mdp: parseInt(mdp)
            });

            if (response.status === 200) {
                // On met à jour l'état utilisateur dans App.tsx
                setUser({ nom: nom, id: response.data.userId });
                // On redirige vers la page d'accueil
                navigate('/');
            }
        } catch (err) {
            console.error(err);
            setError("Nom d'utilisateur ou mot de passe incorrect.");
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>Connexion</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Nom d'utilisateur :</label>
                    <input
                        type="text"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Mot de passe (Chiffres) :</label>
                    <input
                        type="number"
                        value={mdp}
                        onChange={(e) => setMdp(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                <button type="submit" style={{ padding: '10px', background: '#333', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Se connecter
                </button>
            </form>
        </div>
    );
}