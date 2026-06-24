import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

// Importations de tes hooks personnalisés
import { useGetToggle } from "../hooks/useCalls"; 
import { useToggleSettings } from "../lib/graphql.service"; // Si nécessaire pour la mutation, ou utilise ton hook adapté

const SwitchContext = createContext();

export const SwitchProvider = ({ children }) => {
  // 1. Récupération du statut global depuis le backend (GraphQL)
  const { settings, loaded_settings, refetchSettings } = useGetToggle();
  
  // Destructuration de ta mutation GraphQL (Assure-toi que le nom correspond à ton hook de mutation)
  // J'utilise ici l'appel GraphQL que tu as préparé
  const [toggleDisable, { loading: disabling }] = useToggleSettings(); 

  // 2. Initialisation de l'état "enabled" (Utilisateur - Local via Cookies)
  const [enabled, setEnabled] = useState(() => {
    const saved = Cookies.get("switchMode");
    return saved ? JSON.parse(saved) : true; // default true
  });
   const [disabled,setDisabled]=useState(false);
  // 3. L'état "disabled" (Admin - Global) dépend directement de la BDD GraphQL
  // Par défaut false pendant le chargement, puis prend la valeur de la BDD
  // const disabled = settings?.modalEventDisabled || false;

  // Sauvegarde automatique du choix de l'utilisateur ('enabled') dans son cookie local

  useEffect(() => {
  if (settings) { // On vérifie simplement si l'objet settings est là
    setDisabled(settings.modalEventDisabled || false);
  }
}, [settings]); // S'exécute à chaque fois que 'settings' change (y compris après le refetchSettings)
  useEffect(() => {
    // Si l'admin a bloqué le modal globalement, on force l'état local à false
    if (disabled) {
      setEnabled(false);
    } else {
      Cookies.set("switchMode", JSON.stringify(enabled), { expires: 365, SameSite: "Lax" });
    }
  }, [enabled, disabled]);

  // ACTION UTILISATEUR : Basculer l'affichage local (uniquement si non bloqué par l'admin)
  const toggle = () => {
    if (disabled) return;
    setEnabled((prev) => !prev);
  };
console.log(settings,"settings")
  // ACTION ADMIN : Déclencher la mutation GraphQL pour couper/activer le modal pour TOUT LE MONDE
  const disableToggle = async () => {
    try {
      // Exécution de la mutation GraphQL sur le backend Node.js
   const {data:response} =   await toggleDisable();


      
      // Force la Query GraphQL à se recharger pour mettre à jour l'état 'disabled' sur le champ
      if (response?.toggleDisable) {
      //  setDisabled(response?.toggleDisable?.modalEventDisabled);
        await refetchSettings();
      }
    } catch (error) {
      console.error("Erreur lors du toggle global de l'admin :", error);
    }
  };

  return (
    <SwitchContext.Provider
      value={{
        enabled,           // État individuel (Cookies)
        disabled,          // État global (GraphQL / MongoDB)
        disabling,         // État de chargement de la mutation (Utile pour afficher un spinner sur le bouton admin)
        loaded_settings,   // Booléen indiquant si la query GraphQL est chargée
        toggle,            // Fonction pour l'utilisateur
        disableToggle,     // Fonction pour l'admin (Mutation)
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