import React, {useContext, useState} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {QueryClient, QueryClientProvider} from 'react-query';
import styled from '@emotion/styled';

import {Header} from './components/Header';
import {AccountScreen} from './screens/Account';
import {HomeScreen} from './screens/Home';
import {NotFoundScreen} from './screens/NotFound';
import {UnderConstruction} from './screens/UnderConstruction';
import {BlockScreen} from './screens/Block';
import {NetworkScreen} from './screens/Network';
import {FaucetScreen} from './screens/Faucet';
import {NodeScreen} from './screens/Node';
import {Donate} from './components/Donate';
import dayjs from 'dayjs';
import {
    FaEnvelopeSquare,
    FaReddit,
    FaRedditSquare,
    FaTwitter,
    FaTwitterSquare,
    FaRunning,
    FaGithub,
    FaMoon, FaSun
} from 'react-icons/fa';
import Theme, {ThemeContext} from "./components/Theme";
import { useMediaQuery } from 'react-responsive'
import {Toaster} from "react-hot-toast";

const queryClient = new QueryClient();

const Footer = styled.footer`
  background: var(--header);
  border-top: 1px solid var(--primary-border);
  padding: 1rem;
  row-gap: 0.5rem;
  display: flex;
  line-height: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;

  & > div {
    flex: 1;
    text-align: left;
  }

  & > main {
    width: 100%;
    text-align: center;
  }

  @media (max-width: 540px) {
    padding: 0.5rem;
    flex-direction: column;

    & > div {
      display: none;
    }

    & > main {
      order: 2;
    }
    .donate {
      display: block;
      text-align: center;
      order: 1;
    }
  }
`;

export const App: React.FC = () => {

    const { toggle } = useContext(ThemeContext);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const [dark, setDarkColor] = useState(prefersDark);

    const isSmallerThan600 = useMediaQuery({
        query: '(max-width: 600px)'
    })

    const setDark = () => {
        setDarkColor(!dark)
        toggle();
    }

    return <QueryClientProvider client={queryClient}>
        <Theme dark={dark} setDark={setDark}>

            <BrowserRouter>
                <Header dark={dark} setDark={setDark}/>

                <Switch>
                    <Route path="/" exact component={HomeScreen}/>
                    <Route path="/:address(nano_[a-zA-Z0-9]+)" component={AccountScreen}/>
                    <Route path="/:address(xrb_[a-zA-Z0-9]+)" component={AccountScreen}/>
                    <Route path="/:hash([a-fA-F0-9]{64})" component={BlockScreen}/>
                    <Route path="/network" component={NetworkScreen}/>
                    <Route path="/node" component={NodeScreen}/>
                    <Route path="/faucet" component={FaucetScreen}/>
                    <Route component={NotFoundScreen}/>
                </Switch>

                <Footer>
                    <div style={{textAlign: 'right'}}>
                        Made 100% with Nano
                    </div>
                    <div style={{textAlign: 'center'}}>
                        <a href="https://nano.org" target="_blank" rel="noreferrer noopener">What is Nano?</a>
                    </div>
                    <Donate/>
                    <main>
                        <p style={{display: 'flex',justifyContent: 'center',alignItems: "center"}}>
                             {
                                isSmallerThan600 && (
                                    dark ? (
                                        <button style={{padding: 0}} onClick={setDark}>
                                            <FaMoon color={'#558BC9'} size={25} style={{marginRight: '1rem'}}/>
                                        </button>
                                    ) : (
                                        <button style={{padding: 0}} onClick={setDark}>
                                            <FaSun color={'#558BC9'} size={25} style={{marginRight: '1rem'}}/>
                                        </button>

                                    )
                                )

                            }
                            <a href="mailto:saizo@nanocafe.cc" target="_blank" rel="noreferrer noopener" title="Contact">
                                <FaEnvelopeSquare size="2rem"/>
                            </a>
                            <a href="https://www.reddit.com/r/nanocurrency" target="_blank" rel="noreferrer noopener" title="/r/nanocurrency">
                                <FaRedditSquare size="2rem"/>
                            </a>
                            <a href="https://nanolooker.com" target="_blank" rel="noreferrer noopener" title="Adv. Explorer">
                                <FaRunning size="2rem"/>
                            </a>
                            <a href="https://github.com/nanocafe/nanocafe" target="_blank" rel="noreferrer noopener" title="Github nanocafe repository">
                                <FaGithub size="2rem"/>
                            </a>
                        </p>
                        <p>
                            Copyright &copy; {dayjs().get('year')} Nanocafe.cc
                        </p>
                    </main>
                </Footer>

            </BrowserRouter>
        </Theme>
    </QueryClientProvider>;
};
