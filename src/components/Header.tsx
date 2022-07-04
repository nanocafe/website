import React, { useContext, useEffect, useState, useRef} from 'react';
import { Link, NavLink } from 'react-router-dom';
import { css } from '@emotion/css';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';

import { ConfirmationQuorumPeer, Telemetry, useBinanceTicker, useConfirmationQuorum, useTelemetry, useTPS } from '../api';
import { formatSI, safeRawToMega } from '../utils';
import { Search } from './Search';
import { FaMoon } from "react-icons/fa";
import { FaSun } from "react-icons/fa";
import { ThemeContext } from "./Theme";
import { useMediaQuery } from "react-responsive";
import { Toaster } from "react-hot-toast";
import * as math from "mathjs";

const header = css`
  background: var(--header);
  
  & > nav, section {
    display: flex;
    flex-direction: row;
    align-items: center;
    border-bottom: 1px solid var(--primary-border);
  }
  & > nav {
    font-size: 1.1rem;
    @media (max-width: 540px) {
      a {
        display: none;
      }
      a:first-of-type {
        display: flex;
        z-index: 1000;
      }
    }
    aside {
      margin-left: auto;
      margin-right: 1rem;
      & > button {
        display: none;
        margin-top: 0.5rem;
      }
      @media (max-width: 540px) {
        margin-right: 0;
        & > button {
          display: block;
        }
      }
      nav {
        display: flex;
        position: fixed;
        top: 4.05rem;
        right: 0;
        background: var(--header);
        z-index: 10007;
        flex-direction: column;
        width: 200px;
        gap: 0.5rem;
        height: calc(100% - 4.05rem);
        border-left: 1px solid var(--primary-border);
        transform: translateX(100%);
        transition: transform 0.2s;
        & > a {
          display: flex;
          padding: 1rem !important;
        }
        &.visible {
          transform: translateX(0);
        }
        div {
          padding: 0 0.5rem;
          font-size: 0.9rem;
          &:first-of-type {
            margin-top: auto;
          }
          &:last-of-type {
            margin-bottom: 0.5rem;
          }
          a {
            display: inline !important;
            border: none;
          }
          
          button: {
            color: #c09a6b;
          }
        }
      }
    }
  }
  section {
    overflow-x: auto;
    overflow-y: hidden;
    padding: 0.5rem 1.05rem;
    @media (max-width: 540px) {
      padding: 1rem;
    }
    span, em {
      white-space: nowrap;
      font-family: sans-serif;
      
    }
    
    span {
      font-size: 0.8rem;
      color: var(--primary);
      font-weight: 600;
      &.ticker {
        font-size: 1rem;
        margin-left: 0;
      }
      &.separated {
        position: relative;
        margin-left: 1rem;
        &::before {
          display: block;
          content: ' ';
          border-right: 1px solid var(--primary-border);
          height: 3.5rem;
          position: absolute;
          top: -1.1rem;
          left: -0.75rem;
          transform: rotateZ(15deg);
        }
      }
    }
    em {
      font-family: var(--font-mono);
      font-size: 0.8rem;
      margin: 0 0.5rem;
      &.positive {
        color: var(--green);
      }
      &.negative {
        color: var(--red);
      }
      &:last-of-type {
        padding-right: 1rem;
      }
    }
  }
  h2 {
    color: var(--red);
    font-weight: 500;   
  }
  a {
    display: flex;
    flex-direction: row;
    align-items: center;
    align-self: stretch;
    position: relative;
    color: var(--primary);
    text-decoration: none;
    top: 1px;
    border-bottom: 2px solid transparent;
    padding: 0 1rem;
    &:first-of-type {
      padding-left: 0;
    }
    &:hover, &.active {
      border-bottom-color: var(--primary);
    }
    @media (max-width: 540px) {
      border-bottom: none;
      border-left: 2px solid transparent;
      &:hover, &.active {
        border-left-color: var(--primary);
      }
    }
  }
  button.modeToggle {
    color: var(--primary);
    padding: 0;
    margin-right: 1rem;
    &:hover {
      color: var(--hover);
      cursor: pointer;
    }
  }
  img {
    width: 4rem;
    height: 4rem;
  }
`;



const Menu: React.FC = () => {
  return <>
    <NavLink to="/charts">Charts</NavLink>
    <NavLink to="earn">Earn</NavLink>
    <NavLink to="/faucet">Faucet</NavLink>
    <NavLink to="/network">Network</NavLink>

  </>;
};

function checkParent(target: HTMLElement): boolean {
  let parent: HTMLElement | null = target;
  while (parent = parent.parentElement) {
    if (parent.classList.contains(header)) {
      return true;
    }
  }

  return false;
}

interface IHeader {
  dark: Boolean;
  setDark: () => void;
}


export const Header: React.FC<IHeader> = ({ dark, setDark }) => {

  const [nanoEur, setNanoEur] = useState<Number>(0);
  const [nanoEurPriceChangePercent, setNanoEurPriceChangePercent] = useState<Number>(0)
  const [nanoEurPriceChange, setNanoEurPriceChange] = useState<Number>(0)
  const [menuExpanded, setMenuExpanded] = useState<Boolean>(false);
  const tpsQuery = useTPS();

  const telemetryQuery = useTelemetry();
  const quorumQuery = useConfirmationQuorum();
  const ticker = useBinanceTicker('XNOUSDT');
  const nanoBtcTicker = useBinanceTicker('XNOBTC');

  const isPositive = parseFloat(ticker.data?.priceChangePercent ?? '0') > 0;
  const isPositiveNanoBtc = parseFloat(nanoBtcTicker.data?.priceChangePercent ?? '0') > 0;

  const isSmallerThan600 = useMediaQuery({
    query: '(max-width: 600px)'
  })

  function hideMenu(e: TouchEvent) {
    if ((e.target as HTMLElement).tagName === 'NAV') {
      setMenuExpanded(false);
      return;
    }
    if (checkParent(e.target as HTMLElement)) {
      e.stopPropagation();
      return;
    }

    setMenuExpanded(false);
  }

  function alwaysHideMenu() {
    setMenuExpanded(false);
  }

  function getQuorumNode(node: Telemetry): ConfirmationQuorumPeer | undefined {
    return quorumQuery.data?.peers.find((peer) => peer.ip === `[${node.address}]:${node.port}`);
  }

  const tpsData = tpsQuery.data ? Object.entries(tpsQuery.data).filter(([node]) => {
    const telemetry = telemetryQuery.data?.metrics.find((telemetry) => telemetry.node_id === node);
    const quorumNode = telemetry ? getQuorumNode(telemetry) : undefined;
    const isPR = parseFloat(safeRawToMega(quorumNode?.weight)) / (parseFloat(safeRawToMega(quorumQuery.data?.online_stake_total)) || 1) * 100 > 0.01;
    return isPR;
  }).map(([_, tps]) => tps) : [];

  useEffect(() => {
    document.addEventListener('touchstart', hideMenu);
    document.addEventListener('touchmove', alwaysHideMenu);
    fetch('https://api.kraken.com/0/public/Ticker?pair=NANOEUR')
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setNanoEur(+data.result['NANOEUR'].c[0])
        const currentPrice = +data.result['NANOEUR'].c[0];
        const lastPrice = +data.result['NANOEUR'].o;

        const priceChangePercent = (currentPrice - lastPrice) / currentPrice * 100;
        const priceChange = (currentPrice - lastPrice);

        setNanoEurPriceChangePercent(priceChangePercent);
        setNanoEurPriceChange(priceChange);

      })

    return () => {
      document.removeEventListener('touchstart', hideMenu);
      document.removeEventListener('touchmove', alwaysHideMenu);
      clearInterval(interval);
    };
  }, []);

  return <header className={header}>
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // Define default options
        className: '',
        duration: 5000,
        style: {
          background: '#363636',
          color: '#fff',
        },
        // Default options for specific types
        success: {
          duration: 3000,
          theme: {
            primary: 'green',
            secondary: 'black',
          },
        },
      }}
    />
    <nav>
      <Link to="/">
        {
          dark
            ? <img src={require('url:../../assets/logo_dark.svg')} />
            : <img src={require('url:../../assets/logo.svg')} />
        }

        <h1>Nanocafe</h1>
      </Link>
      <Menu />

      <aside>
        <Search />

        <button onClick={() => setMenuExpanded(!menuExpanded)}>
          {!menuExpanded
            ? <AiOutlineMenu size="1.75rem" color="var(--primary)" />
            : <AiOutlineClose size="1.75rem" color="var(--primary)" />
          }
        </button>

        <nav className={menuExpanded ? 'visible' : undefined}>
          <Menu />
        </nav>
      </aside>

      {
        !isSmallerThan600 && (
          dark ? (
            <button className={"modeToggle"} onClick={setDark}>
              <FaMoon size={25} />
            </button>
          ) : (
            <button className={"modeToggle"} onClick={setDark}>
              <FaSun size={25} />
            </button>

          )
        )

      }


    </nav>
    <section>
      {ticker.data ? <>

        <span style={{ padding: '0 0 0 1rem' }} className="" title="The Estimated Transactions Per Second (PR weighted) For The Nano Network">Avg. TPS:</span>
        <em title="The Estimated Transactions Per Second (PR weighted) For The Nano Network">
          {(tpsData && tpsData.length > 0) ? math.mean(tpsData).toFixed(2) : '...'}
        </em>

        <span style={{ padding: '0 0 0 1rem' }} className="">Market Cap:</span>
        <em>${formatSI(133248297 * parseFloat(ticker.data?.lastPrice))}</em>
{/*         Need to add all exchange trading volume, currently only displays XNO volume
        <span style={{ padding: '0 0 0 1rem' }} className="" title="XNOUSDT Volume">Volume:</span>
        <em>${formatSI(parseFloat(ticker.data.volume) * parseFloat(ticker.data.weightedAvgPrice))}</em> */}


        <span className="separated" title="Nano Currency">1 Ӿ: </span>
        <em title="XNOUSDT Price">USDT {parseFloat(ticker.data?.lastPrice).toFixed(2)}</em>
        <em title="% Change in Price" className={isPositive ? 'positive' : 'negative'}>
          {isPositive ? '↑' : '↓'} {Number(ticker.data?.priceChange).toFixed(2)} {Number(ticker.data?.priceChangePercent).toFixed(2)}%
        </em>

        <span className="separated" />
        <em title="NANOEUR Price">Euro €{nanoEur ? nanoEur.toFixed(2) : '---'}</em>
        <em title="% Change in Price" className={nanoEurPriceChangePercent > 0 ? 'positive' : 'negative'}>
          {nanoEurPriceChangePercent > 0 ? '↑' : '↓'} {(nanoEurPriceChange).toFixed(2)} {nanoEurPriceChangePercent.toFixed(2)}%
        </em>

        <span className="separated" />
        <em title="NANOBTC Price">BTC {parseFloat(nanoBtcTicker.data ? nanoBtcTicker.data?.lastPrice : "")}</em>

        <em title="% Change in Price" className={isPositiveNanoBtc ? 'positive' : 'negative'}>
          {isPositiveNanoBtc ? '↑' : '↓'} {nanoBtcTicker.data?.priceChange} {Number(nanoBtcTicker.data?.priceChangePercent).toFixed(2)}%
        </em>

      </> : <>
        ---
      </>}
    </section>
     {/* <section><h2>Notice: Explorer service is currently under maintenance, faucet service is functional</h2></section> */}
  </header>;
};
