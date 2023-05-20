import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import ReactGA from "react-ga4";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ThemeProvider from "../contexts/Theme";
import { AppProps } from "next/app";
import { useRouter } from "next/router";

import "../styles/globals.scss";
import "../styles/modal.css";

const queryClient = new QueryClient();

ReactGA.initialize(process.env.NEXT_PUBLIC_GA_UID || '');

export default function App({ Component, pageProps }: AppProps) {
  // Enable dark mode accordding to device / browser configuration.
  // Or if the user has changed the website to dark (saved in localStorage)

  const { pathname } = useRouter();

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: pathname });
  }, [pathname]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Header />

        {/* <Switch>
          <Route path="/" exact component={HomeScreen} />
        </Switch> */}

        <Component {...pageProps} />

        <Footer />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
