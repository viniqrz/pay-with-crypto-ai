import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeConfig {
  primary: string;
  background: string;
  text: string;
  radius: string;
  font: string;
}

interface ThemeContextType {
  theme: ThemeConfig;
  updateTheme: (newTheme: Partial<ThemeConfig>) => void;
  applyTheme: (prompt: string) => Promise<void>;
  isLoading: boolean;
}

const defaultTheme: ThemeConfig = {
  primary: "#6366f1", // Neon Indigo
  background: "#020617", // Deepest Slate
  text: "#f8fafc",
  radius: "1rem",
  font: "Inter"
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeConfig>(defaultTheme);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary', theme.primary);
    root.style.setProperty('--background', theme.background);
    root.style.setProperty('--text', theme.text);
    root.style.setProperty('--radius', theme.radius);
    root.style.fontFamily = theme.font;
  }, [theme]);

  const updateTheme = (newTheme: Partial<ThemeConfig>) => {
    setTheme(prev => ({ ...prev, ...newTheme }));
  };

  const applyTheme = async (prompt: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/theme/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      if (data) {
        setTheme(data);
      }
    } catch (error) {
      console.error('Failed to generate theme:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, applyTheme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
