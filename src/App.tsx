import React, { useContext, useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

import { Header } from './components/Header';
import { AccountScreen } from './screens/Account';
import { HomeScreen } from './screens/Home';
import { NotFoundScreen } from './screens/NotFound';
import { UnderConstruction } from './screens/UnderConstruction';
import { BlockScreen } from './screens/Block';
import { NetworkScreen } from './screens/Network';
import { FaucetScreen } from './screens/Faucet';
import { NodeScreen } from './screens/Node';
import { Footer } from './components/Footer';

import Theme from "./components/Theme";

const queryClient = new QueryClient();

export const App: React.FC = () => {

    // Enable dark mode accordding to device / browser configuration.
    // Or if the user has changed the website to dark (saved in localStorage)
    const matchMediaDark = window.matchMedia('(prefers-color-scheme: dark)')
    const prefersDark = matchMediaDark.matches || localStorage.isDarkTheme;
    useEffect(() => matchMediaDark.addEventListener('change', e => e.matches != dark ? setDark() : null), []);

    const [dark, setDarkColor] = useState(prefersDark);

    const setDark = () => setDarkColor(!dark)

    return <QueryClientProvider client={queryClient}>
        <Theme dark={dark} setDark={setDark}>

            <BrowserRouter>
                <Header dark={dark} setDark={setDark} />

                <Switch>
                    <Route path="/" exact component={HomeScreen} />
                    <Route path="/:address(nano_[a-zA-Z0-9]+)" component={AccountScreen} />
                    <Route path="/:address(xrb_[a-zA-Z0-9]+)" component={AccountScreen} />
                    <Route path="/:hash([a-fA-F0-9]{64})" component={BlockScreen} />
                    <Route path="/network" component={NetworkScreen} />
                    <Route path="/node" component={NodeScreen} />
                    <Route path="/faucet" render={(props) => (
                        <FaucetScreen theme={dark ? "dark" : "light"} />
                    )} />
                    <Route component={NotFoundScreen} />
                </Switch>

                <Footer dark={dark} setDark={setDark}></Footer>

            </BrowserRouter>
        </Theme>
    </QueryClientProvider>;
};
