import React, { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import ReactGA from "react-ga4";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import Theme from "../components/Theme";
import { AppProps } from "next/app";
import { useRouter } from "next/router";

import "../styles/globals.scss";
import "../styles/modal.css";

const queryClient = new QueryClient();

ReactGA.initialize(process.env.NEXT_PUBLIC_GA_UID || '');

export default function App({ Component, pageProps }: AppProps) {
  // Enable dark mode accordding to device / browser configuration.
  // Or if the user has changed the website to dark (saved in localStorage)

  const [dark, setDarkColor] = useState(false);

  const setDark = () => setDarkColor(!dark);

  useEffect(() => {
    const matchMediaDark = window.matchMedia("(prefers-color-scheme: dark)");
    const prefersDark = matchMediaDark.matches || localStorage.isDarkTheme;
    setDarkColor(prefersDark);
    matchMediaDark.addEventListener("change", (e) =>
      e.matches != dark ? setDark() : null
    );
  }, []);

  const { pathname } = useRouter();

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: pathname });
  }, [pathname]);

  return (
    <QueryClientProvider client={queryClient}>
      <Theme dark={dark} setDark={setDark}>
        <Header dark={dark} setDark={setDark} />

        {/* <Switch>
          <Route path="/" exact component={HomeScreen} />
          <Route
            path="/:address(nano_[a-zA-Z0-9]+)"
            component={AccountScreen}
          />
          <Route path="/:address(xrb_[a-zA-Z0-9]+)" component={AccountScreen} />
          <Route path="/:hash([a-fA-F0-9]{64})" component={BlockScreen} />
          <Route
            path="/faucet"
            render={(props) => <FaucetScreen theme={dark ? "dark" : "light"} />}
          />
          <Route component={NotFoundScreen} />
        </Switch> */}

        <Component {...pageProps} />

        <Footer dark={dark} setDark={setDark}></Footer>
      </Theme>
    </QueryClientProvider>
  );
}
