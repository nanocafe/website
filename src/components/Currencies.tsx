import React, { useEffect } from "react";
import { Cashify } from "cashify";
import axios from "axios";
import { useBinanceTicker } from "../api";
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
    overflow-x: auto;
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
    gap: 30px;
  }
  .currency-inner div:first-child {
    color: #616161;
  }
`;

export const Currencies = () => {
  const ticker = useBinanceTicker("XNOUSDT");
  const [rates, setRates] = React.useState<any>();
  const [currencies, setCurrencies] = React.useState<
    {
      [key: string]: {
        value: string;
        symbol: string;
      };
    }[]
  >([]);

  useEffect(() => {
    axios.get("https://api.exchangerate-api.com/v4/latest/usd").then((res) => {
      setRates(res.data.rates);
    });
  }, []);

  useEffect(() => {
    // @ts-ignore
    const usdt = parseFloat(ticker?.data?.lastPrice);
    if (rates && usdt) {
      const cashify = new Cashify({ base: "USD", from: "USD", rates: rates });

      const inr = cashify
        .convert(usdt, {
          to: "INR",
        })
        .toFixed(2);
      const brl = cashify
        .convert(usdt, {
          to: "BRL",
        })
        .toFixed(2);
      const cad = cashify
        .convert(usdt, {
          to: "CAD",
        })
        .toFixed(2);
      const idr = cashify
        .convert(usdt, {
          to: "IDR",
        })
        .toFixed(2);
      const krw = cashify
        .convert(usdt, {
          to: "KRW",
        })
        .toFixed(2);
      setCurrencies([
        { INR: { value: inr, symbol: "₹" } },
        { BRL: { value: brl, symbol: "R$" } },
        { CAD: { value: cad, symbol: "CA$" } },
        { IDR: { value: idr, symbol: "Rp" } },
        { KRW: { value: krw, symbol: "₩" } },
      ]);
    }
  }, [rates, ticker]);

  console.log(rates);
  return (
    <div className={currencyStyles}>
      <div className="wrapper">
        {currencies.map((currency, index) => {
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
