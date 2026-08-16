import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>(() => {
        const savedTheme = localStorage.getItem('theme') as Theme;
        return savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    });

    useEffect(() => {
        localStorage.setItem('theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--adm-color-primary', '#580B1E');
        root.style.setProperty('--adm-color-secondary', '#D4AF37');
        root.style.setProperty('--adm-color-teal', '#00F5FF');
        root.style.setProperty('--adm-color-charcoal', '#121212');
        root.style.setProperty('--adm-color-slate', '#1E2023');
        root.style.setProperty('--adm-text-primary', '#121212');
        root.style.setProperty('--adm-bg-main', '#FFFFFF');
        root.style.setProperty('--adm-button-border-radius', '12px');
    }, []);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};


