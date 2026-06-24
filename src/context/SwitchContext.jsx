import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

const SwitchContext = createContext();

export const SwitchProvider = ({ children }) => {
  // 1. Initialisation de l'état "enabled" depuis les cookies
  const [enabled, setEnabled] = useState(() => {
    const saved = Cookies.get("switchMode");
    return saved ? JSON.parse(saved) : true; // default true
  });

  // 2. Initialisation de l'état "disabled" depuis les cookies
  const [disabled, setDisabled] = useState(() => {
    const cleared = Cookies.get("disableMode");
    return cleared ? JSON.parse(cleared) : false; // default false
  });

  // Sauvegarde automatique de 'enabled' dans un cookie (valable 365 jours)
  useEffect(() => {
    Cookies.set("switchMode", JSON.stringify(enabled), { expires: 365, SameSite: "Lax" });
  }, [enabled]);

  // Sauvegarde automatique de 'disabled' ET réinitialisation sécurisée de 'enabled'
  useEffect(() => {
    if (disabled) {
      setEnabled(false);
    }
    Cookies.set("disableMode", JSON.stringify(disabled), { expires: 365, SameSite: "Lax" });
  }, [disabled]);

  // ACTION CONTRÔLÉE : Toggle seulement si non désactivé
  const toggle = () => {
    setEnabled((prev) => {
      if (disabled) return false;
      return !prev;
    });
  };

  // ACTION CONTRÔLÉE : Alterne l'état de désactivation globale
  const toggleDisable = () => {
    setDisabled((prev) => !prev);
  };

  return (
    <SwitchContext.Provider
      value={{
        enabled,
        disabled,
        toggle,
        toggleDisable,
        setDisabled,
        setEnabled
      }}
    >
      {children}
    </SwitchContext.Provider>
  );
};

export const useSwitch = () => {
  const context = useContext(SwitchContext);

  if (!context) {
    throw new Error("useSwitch doit être utilisé dans un SwitchProvider");
  }

  return context;
};