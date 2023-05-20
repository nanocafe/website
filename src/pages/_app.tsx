import React, { useState, useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import ReactGA from "react-ga4";
import { Header } from "../components/Header";
import { AccountScreen } from "./Account";
import { HomeScreen } from "./home";
import { NotFoundScreen } from "./NotFound";
import { BlockScreen } from "./Block";
import { NetworkScreen } from "./Network";
import { FaucetScreen } from "./Faucet";
import { ChartsScreen } from "./Charts";
import { EarnScreen } from "./Earn";
import { NodeScreen } from "./Node";
import { Footer } from "../components/Footer";
import Theme from "../components/Theme";
import "../styles/modal.css";
import { AppProps } from "next/app";
import { useRouter } from "next/router";

const queryClient = new QueryClient();

ReactGA.initialize("G-QFJTHTGN0Z");

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
      {/* <Theme dark={dark} setDark={setDark}>
        <Header dark={dark} setDark={setDark} /> */}

        {/* <Switch>
          <Route path="/" exact component={HomeScreen} />
          <Route
            path="/:address(nano_[a-zA-Z0-9]+)"
            component={AccountScreen}
          />
          <Route path="/:address(xrb_[a-zA-Z0-9]+)" component={AccountScreen} />
          <Route path="/:hash([a-fA-F0-9]{64})" component={BlockScreen} />
          <Route path="/network" component={NetworkScreen} />
          <Route path="/node" component={NodeScreen} />
          <Route path="/charts" component={ChartsScreen} />
          <Route path="/earn" component={EarnScreen} />
          <Route
            path="/faucet"
            render={(props) => <FaucetScreen theme={dark ? "dark" : "light"} />}
          />
          <Route component={NotFoundScreen} />
        </Switch> */}

        <Component {...pageProps} />

        {/* <Footer dark={dark} setDark={setDark}></Footer>
      </Theme> */}
    </QueryClientProvider>
  );
}
