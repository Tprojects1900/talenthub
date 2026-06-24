import { createContext, useContext, useEffect, useState } from "react";

const SwitchContext = createContext();

export const SwitchProvider = ({ children }) => {
  // 1. Initialisation de l'état "enabled"
  const [enabled, setEnabled] = useState(() => {
    const saved = localStorage.getItem("switchMode");
    return saved ? JSON.parse(saved) : true; // default true
  });

  // 2. Initialisation de l'état "disabled"
  const [disabled, setDisabled] = useState(() => {
    const cleared = localStorage.getItem("disableMode");
    return cleared ? JSON.parse(cleared) : false; // default false
  });

  // Sauvegarde automatique de 'enabled' quand il change
  useEffect(() => {
    localStorage.setItem("switchMode", JSON.stringify(enabled));
  }, [enabled]);

  // Sauvegarde automatique de 'disabled' ET réinitialisation sécurisée de 'enabled'
  useEffect(() => {
    if (disabled) {
      setEnabled(false);
    }
    localStorage.setItem("disableMode", JSON.stringify(disabled));
  }, [disabled]);

  // ACTION CONTROLEE : Toggle seulement si non désactivé
  const toggle = () => {
    setEnabled((prev) => {
      // Si le mode "disabled" est actif, on force à rester à false
      if (disabled) return false;
      return !prev;
    });
  };

  // ACTION CONTROLEE : Alterne l'état de désactivation globale
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
        // Éviter de passer les setters directs (setEnabled/setDisabled) pour garder le contrôle
        // Mais si tu en as absolument besoin ailleurs, tu peux les rajouter.
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