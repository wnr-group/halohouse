import { createContext, useContext } from "react";
import { Theme, THEME_A } from "./theme";

const ThemeContext = createContext<Theme>(THEME_A);

export const ThemeProvider = ThemeContext.Provider;

export const useTheme = () => useContext(ThemeContext);
