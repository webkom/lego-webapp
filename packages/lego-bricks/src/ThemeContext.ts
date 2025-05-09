import { createContext, useContext } from 'react';

export const ThemeContext = createContext<'dark' | 'light'>('light');

export const useTheme = () => useContext(ThemeContext);
