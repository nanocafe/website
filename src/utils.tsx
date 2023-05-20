import React from "react";
import BigNumber from "bignumber.js";

const TunedBigNumber: any = BigNumber.clone({
  EXPONENTIAL_AT: 1e9,
  DECIMAL_PLACES: 36,
});

const PREFIXES: Record<string, string> = {
  "24": "Y",
  "21": "Z",
  "18": "E",
  "15": "P",
  "12": "T",
  "9": "B",
  "6": "M",
  "3": "k",
  "0": "",
  "-3": "m",
  "-6": "µ",
  "-9": "n",
  "-12": "p",
  "-15": "f",
  "-18": "a",
  "-21": "z",
  "-24": "y",
};

export function rawToMega(raws: string | number) {
  const megaNano = "1000000000000000000000000000000"; //raws
  return TunedBigNumber(raws).dividedBy(megaNano).toString(10);
}

export function formatSI(num: number | string): string {
  if (+num === 0) {
    return "0";
  }
  let sig = Math.abs(+num); // significand
  let exponent = 0;
  while (sig >= 1000 && exponent < 24) {
    sig /= 1000;
    exponent += 3;
  }
  while (sig < 1 && exponent > -24) {
    sig *= 1000;
    exponent -= 3;
  }

  if (sig > 1000) {
    // exponent == 24
    // significand can be arbitrarily long
    return sig.toFixed(2) + PREFIXES[exponent];
  }
  return sig.toFixed(2) + PREFIXES[exponent];
}

export function safeRawToMega(amount?: string): string {
  let val = "0";
  try {
    val = rawToMega(amount ?? "0");
  } finally {
    return val;
  }
}

interface RawToMegaProps {
  amount?: string;
}

export const RawToMega: React.FC<RawToMegaProps> = ({ amount }) => {
  const [int, decimal] = safeRawToMega(amount).split(".");
  const left = decimal?.substr(0, 12);
  const right = decimal?.substr(12);

  return (
    <>
      {new Intl.NumberFormat().format(parseInt(int))}
      {left && <span className="grey">.{left}</span>}
      <span className="grey hide-on-mobile">{right}</span>
    </>
  );
};

export type Maybe<T> = T | undefined;

export const isHex = (str: string): boolean => {
  return /^[A-F0-9]+$/i.test(str);
};

export const isBlockHash = (value: string) =>
  isHex(value) && value.length === 64;
