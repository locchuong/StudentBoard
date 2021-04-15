import React, { useContext, useState } from "react";

const ThemeContext = React.createContext();

export function useTheme() {
    return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
  const [isFullscreen, setisFullscreen] = useState(false);
  const [isOverflowAuto, setisOverflowAuto] = useState(false);
  const [mobileHeader, setMobileHeader] = useState(null);
  const value = {
      isOverflowAuto,
      setisOverflowAuto,
      isFullscreen,
      setisFullscreen,
      mobileHeader,
      setMobileHeader,
  };

  
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
