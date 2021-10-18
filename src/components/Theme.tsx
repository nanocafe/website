import React, { useLayoutEffect } from "react";

export const ThemeContext = React.createContext();

interface IThemeProvider {
    dark: boolean;
    setDark: () => void;
}

const ThemeProvider: React.FC<IThemeProvider> = ({ children, dark, setDark }) => {
    // keeps state of the current theme

    // paints the app before it renders elements
    useLayoutEffect(() => {
        // Media Hook to check what theme user prefers
        applyTheme();
        toggle()

    }, [dark]);

    const applyTheme = () => {

        const body = document.getElementsByTagName("body")[0];

        if (dark) {
            body.classList.add("dark-mode")
            body.classList.remove("light-mode")
        } else {
            body.classList.add("light-mode")
            body.classList.remove("dark-mode")
        }
    };

    const toggle = () => {

        dark ? window.localStorage.setItem('isDarkTheme', 'true') : window.localStorage.removeItem('isDarkTheme');

        // A smooth transition on theme switch
        const body = document.getElementsByTagName("body")[0];
        body.style.cssText = "transition: background .5s ease";
    };

    return (
        <ThemeContext.Provider
            value={{
                dark,
                toggle
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export default ThemeProvider;