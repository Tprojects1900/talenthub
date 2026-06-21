import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import Loader from "../components/Loader";

const AuthMiddleware = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation(); // Permet de savoir où l'utilisateur essaie d'aller
    const token = Cookies.get("token");
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // RÈGLE D'OR : Tant que le contexte charge, on ne fait STRICTEMENT rien
        if (loading) return;

        // Si le chargement est fini, on analyse la situation
        if (!token) {
            // Pas de token ? redirection immédiate vers le login
            navigate("/login", { replace: true });
        } else if (user?.user) {
            // On a le token ET l'utilisateur est chargé -> Validation réussie !
            // L'utilisateur reste exactement sur la page (location.pathname) où il était
            setIsChecking(false);
        }
        // NOTE : Si on a un token mais que l'user n'est pas encore là (et que loading est false), 
        // c'est souvent un problème de synchronisation dans l'AuthContext.
        
    }, [user, loading, navigate, token, location.pathname]);

    // On affiche le loader tant que l'état global ou local n'est pas stable
    if (loading || isChecking) {
        return <Loader />;
    }

    return children;
};

export default AuthMiddleware;