import React, {useState, useLayoutEffect} from "react";

export const ThemeContext = React.createContext({
    dark: false,
    toggle: () => {
    }
});

interface IThemeProvider {
    dark: boolean;
    setDark: () => void;
}

const ThemeProvider: React.FC<IThemeProvider> = ({children,dark,setDark}) => {
    // keeps state of the current theme

    // paints the app before it renders elements
    useLayoutEffect(() => {
        // Media Hook to check what theme user prefers
        applyTheme();
        // if state changes, repaints the app
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dark]);

    // rewrites set of css variablels/colors
    const applyTheme = () => {
        let theme;
        if (dark) {
            theme = darkTheme;
        }
        if (!dark) {

            theme = lightTheme;
        }

        const root = document.getElementsByTagName("html")[0];

        // @ts-ignore
        root.style.cssText = theme.join(";");
    };

    const toggle = () => {
        console.log("Toggle Method Called");

        if (dark) {
            window.localStorage.setItem('isDarkTheme', 'true');
        } else {
            window.localStorage.removeItem('isDarkTheme');
        }
        // A smooth transition on theme switch
        const body = document.getElementsByTagName("body")[0];
        body.style.cssText = "transition: background .5s ease";

        setDark();
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

// styles
const lightTheme = [
''
];

const darkTheme = [
    '--primary-border: var(--dark-primary-border)',
    '--primary-transparent: var(--dark-primary-transparent)',
    '--bg: var(--dark-bg)',
    '--text: var(--dark-text)',
    '--header: var(--dark-header)',
];