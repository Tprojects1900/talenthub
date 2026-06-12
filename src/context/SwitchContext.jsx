import { createContext, useContext, useEffect, useState } from "react";

const SwitchContext = createContext();

export const SwitchProvider = ({ children }) => {
  const [enabled, setEnabled] = useState(() => {
    const saved = localStorage.getItem("switchMode");
    return saved ? JSON.parse(saved) : true; //  default true
  });

  useEffect(() => {
    localStorage.setItem("switchMode", JSON.stringify(enabled));
  }, [enabled]);

  const toggle = () => {
    setEnabled((prev) => !prev);
  };

  return (
    <SwitchContext.Provider
      value={{
        enabled,
        setEnabled,
        toggle,
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