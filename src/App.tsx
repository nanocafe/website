import React, { useContext, useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

import ReactGA from 'react-ga4';

import { Header } from './components/Header';
import { AccountScreen } from './screens/Account';
import { HomeScreen } from './screens/Home';
import { NotFoundScreen } from './screens/NotFound';
import { UnderConstruction } from './screens/UnderConstruction';
import { BlockScreen } from './screens/Block';
import { NetworkScreen } from './screens/Network';
import { FaucetScreen } from './screens/Faucet';
import { ChartsScreen } from './screens/Charts';
import { EarnScreen } from './screens/Earn';
import { NodeScreen } from './screens/Node';
import { Footer } from './components/Footer';
import Theme from "./components/Theme";

const queryClient = new QueryClient();

declare const process : {
    env: { GA_UID: string }
}

function usePageViews() {
    ReactGA.initialize(process.env.GA_UID)
    const location = useLocation()
    const { pathname, search } = location
    useEffect(() => {
 
    }, [location])
}

const AppComponent: React.FC = () => {

    // Enable dark mode accordding to device / browser configuration.
    // Or if the user has changed the website to dark (saved in localStorage)
    const matchMediaDark = window.matchMedia('(prefers-color-scheme: dark)')
    const prefersDark = matchMediaDark.matches || localStorage.isDarkTheme;
    useEffect(() => matchMediaDark.addEventListener('change', e => e.matches != dark ? setDark() : null), []);

    const [dark, setDarkColor] = useState(prefersDark);

    const setDark = () => setDarkColor(!dark)
    usePageViews();
    return  <QueryClientProvider client={queryClient}>
        <Theme dark={dark} setDark={setDark}>
            <Header dark={dark} setDark={setDark} />

            <Switch>
                <Route path="/" exact component={HomeScreen} />
                <Route path="/:address(nano_[a-zA-Z0-9]+)" component={AccountScreen} />
                <Route path="/:address(xrb_[a-zA-Z0-9]+)" component={AccountScreen} />
                <Route path="/:hash([a-fA-F0-9]{64})" component={BlockScreen} />
                <Route path="/network" component={NetworkScreen} />
                <Route path="/node" component={NodeScreen} />
                <Route path="/charts" component={ChartsScreen} />      
                <Route path="/earn" component={EarnScreen} />              
                <Route path="/faucet" render={(props) => (
                    <FaucetScreen theme={dark ? "dark" : "light"} />
                )} />
                <Route component={NotFoundScreen} />
            </Switch>

            <Footer dark={dark} setDark={setDark}></Footer>        
        </Theme>
    </QueryClientProvider>;
};

export const App: React.FC = () => {

    return <BrowserRouter>
            <AppComponent />
    </BrowserRouter>;
}
