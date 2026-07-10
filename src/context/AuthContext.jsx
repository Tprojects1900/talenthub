import { createContext, useEffect, useRef, useState } from "react";
import { useGetAuth } from "../lib/graphql.service";
import Cookies from "js-cookie";

export const AuthContext = createContext(null);

const UserContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [getAuth, { data, loading, error }] = useGetAuth();

  const isLoggingOutRef = useRef(false); // flag logout

// Dans ton fichier authContext.jsx, remplace la fonction fetchUser par celle-ci :
const fetchUser = async () => {
  try {
    const token = Cookies.get("token");
    if (token && !isLoggingOutRef.current) {
      try {
        await getAuth();
      } catch (err) {
        console.error("Erreur getAuth:", err);
        setUser(null);
        setIsAuthChecked(true);
      }
    } else {
      setUser(null);
      setIsAuthChecked(true);
    }
  } catch (cookieError) {
    console.error("Impossible de lire les cookies sur cet appareil:", cookieError);
    setUser(null);
    setIsAuthChecked(true);
  }
};

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (data?.getAuth) {
      setUser(data.getAuth);
      setIsAuthChecked(true);
    } else if (!loading) {
      setUser(null);
      setIsAuthChecked(true);
    }
  }, [data, loading]);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, error, isLoggingOutRef }}>
      {children}
    </AuthContext.Provider>
  );
};

export default UserContext;