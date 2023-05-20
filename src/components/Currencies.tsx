import React, { useEffect } from "react";
import axios from "axios";
import { useNanoTicker } from "../api";
import { css } from "@emotion/css";

const currencyStyles = css`
  border: 1px solid #332d2f;
  margin: 10px 0 30px 0;
  border: 1px solid #332d2f;
  margin: 10px 0 30px 0;
  position: relative;
  overflow: hidden;
  --offset: 0vw;
  --move-initial: calc(100% + var(--offset));
  --move-final: calc(-100% + var(--offset));

  .wrapper {
    display: grid;
    height: 35px;
    grid-template-columns: repeat(5, 1fr);
    position: relative;
    transform: translate3d(var(--move-initial), 0, 0);
    animation: marquee 20s linear infinite;
  }
  @keyframes marquee {
    0% {
      transform: translate3d(var(--move-initial), 0, 0);
    }

    100% {
      transform: translate3d(var(--move-final), 0, 0);
    }
  }

  .currency {
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0 10px 0 10px;
    gap: 30px;
  }
  .currency:not(:first-child):before {
    content: "";
    width: 1px;
    height: 120%;
    background-color: #332d2f;
    display: block;
    transform: rotate(25deg) translateX(-7px);
  }
  .currency-inner {
    width: 100%;
    padding-bottom: 10;
    display: flex;
    justify-content: space-between;
    gap: 10px;
  }
  .currency-inner div:first-child {
    color: #616161;
  }
`;

export const Currencies = () => {
  const { data } = useNanoTicker("nano");

  interface Currency {
    value: number;
    symbol: string;
  }

  const cryptoCurrencies: Record<string, Currency>[] = [
    {
      cad: {
        value: data?.market_data.current_price.cad,
        symbol: "CA$",
      },
      brl: {
        value: data?.market_data.current_price.brl,
        symbol: "R$",
      },
      inr: {
        value: data?.market_data.current_price.inr,
        symbol: "₹",
      },
      krw: {
        value: data?.market_data.current_price.krw,
        symbol: "₩",
      },
      idr: {
        value: data?.market_data.current_price.idr,
        symbol: "Rp",
      },
    },
  ];

  return (
    <div className={currencyStyles}>
      <div className="wrapper">
        {cryptoCurrencies.map((currency, index) => {
          return (
            <div key={index} className="currency">
              {Object.keys(currency).map((key, index) => {
                return (
                  <div key={index} className="currency-inner">
                    <div>{key}: </div>
                    <div>
                      {currency[key].symbol}
                      {currency[key].value}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
