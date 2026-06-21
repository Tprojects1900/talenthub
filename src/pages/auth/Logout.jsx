import { useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { AuthContext } from "../../context/AuthContext";

const LogoutPage = () => {
  const navigate = useNavigate();
  const toastShownRef = useRef(false);
  const { setUser, isLoggingOutRef } = useContext(AuthContext);

  useEffect(() => {
    const handleLogout = () => {
      //  Marquer comme logout en cours
      if (isLoggingOutRef) {
        isLoggingOutRef.current = true;
      }

      // Supprimer user + token
      setUser(null);
      Cookies.remove("token");
      localStorage.removeItem("token");

      if (!toastShownRef.current) {
        toast.success("You have been logged out successfully!");
        toastShownRef.current = true;
      }

      //  Rediriger immédiatement
      navigate("/login", { replace: true });
    };

    handleLogout();
  }, [navigate, setUser, isLoggingOutRef]);

  return <Loader />;
};

export default LogoutPage;
