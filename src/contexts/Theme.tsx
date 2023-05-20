import React, { ReactNode, useEffect, useLayoutEffect, useState } from "react";

interface IThemeProvider {
  children: ReactNode;
  isDark?: boolean;
}

export const ThemeContext = React.createContext(
  {} as {
    isDark: boolean;
    toggle: () => void;
  }
);

const ThemeProvider: React.FC<IThemeProvider> = ({
  children,
  isDark = false,
}: IThemeProvider) => {
  // keeps state of the current theme

  const [dark, setDarkColor] = useState(isDark);

  useLayoutEffect(() => {
    // paints the app before it renders elements
    // Prioritize localStorage (as it represents an intentional user action)
    // Otherwise try to use browser config

    const matchMediaDark = window.matchMedia("(prefers-color-scheme: dark)");
    if (
      localStorage.isDarkTheme &&
      matchMediaDark.matches !== localStorage.isDarkTheme
    ) {
      setDarkColor(localStorage.isDarkTheme === "true" ? true : false);
    } else if (localStorage.isDarkTheme === "false") {
      setDarkColor(false);
    } else {
      setDarkColor(matchMediaDark.matches || false);
      matchMediaDark.addEventListener("change", (e) => setDarkColor(e.matches));
    }
  }, []);

  const applyTheme = () => {
    const body = document.getElementsByTagName("body")[0];

    // A smooth transition on theme switch
    body.style.cssText = "transition: background .5s ease";

    if (dark) {
      body.classList.add("dark-mode");
      body.classList.remove("light-mode");
    } else {
      body.classList.add("light-mode");
      body.classList.remove("dark-mode");
    }
  };

  const persistTheme = (toDark: boolean) => {
    toDark
      ? window.localStorage.setItem("isDarkTheme", "true")
      : window.localStorage.setItem("isDarkTheme", "false");
  };

  useEffect(() => {
    applyTheme();
  }, [dark]);

  const toggle = () => {
    setDarkColor(!dark);
    persistTheme(!dark);
  };

  return (
    <ThemeContext.Provider
      value={{
        isDark: dark,
        toggle,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;

export const useTheme = () => React.useContext(ThemeContext);
