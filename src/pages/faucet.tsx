import styled from "@emotion/styled";
import React from "react";
import { GiTap } from "react-icons/gi";
import { Nanodrop } from "../components/Nanodrop";
import { useTheme } from "@/contexts/Theme";

const Container = styled.div`
  text-align: center;
  padding: 3rem 0.5rem;
  flex: 1;

  h2 {
    margin-top: 1rem;
    font-size: 2rem;
  }

  h3 {
    margin-top: 2rem;
    font-size: 1.5rem;
  }

  p {
    margin-top: 1rem;
  }
  .linkText {
    margin-bottom: 2rem;
  }
  form {
    position: relative;
    width: 50%;
    box-sizing: border-box;
    margin: auto;

    @media (max-width: 540px) {
      width: 100%;
    }

    button {
      position: absolute;
      padding: 0.75rem;
      right: 0;
      top: 1rem;
      z-index: 1002;
      color: var(--primary);
    }
  }

  input {
    margin-top: 1rem;
    border: 1px solid var(--primary-border);
    border-radius: 8px;
    padding: 0.65rem;
    font-family: var(--font-mono);
    font-size: 0.9rem;
    box-sizing: border-box;
    width: 100%;
    min-width: min(65ch, 100% - 1rem);

    &.invalid {
      color: var(--red);
    }

    &::placeholder {
      color: var(--primary);
      font-family: var(--font);
    }

    &:focus,
    &:hover {
      outline: none;
    }
  }

  .loading {
    margin-top: 1rem;
  }
`;

interface IFaucet {
  theme: "light" | "dark";
}

export default function FaucetScreen() {
  const { isDark } = useTheme();

  return (
    <Container>
      <GiTap size="5rem" color="var(--primary)" />

      <h2>Faucet</h2>

      <p>
        Experience Nano entirely free! First make a wallet{" "}
        <a href="https://nautilus.io/" target="_blank">
          here
        </a>{" "}
        (mobile) or{" "}
        <a href="https://nault.cc" target="_blank">
          here
        </a>{" "}
        (desktop), then place your address below and enjoy!
      </p>
      {isDark ? "dark" : "light"}
      <Nanodrop theme={isDark ? "dark" : "light"} />
      <p className="linkText">
        Click{" "}
        <a
          href="https://playnano.online/faucets?ref=nano_3odatubif8zuemhgtmdh465somyy9hmdeab6sa15od79cbdu79zgnndx7ozk"
          target="_blank"
          title="Affiliate Link"
        >
          here
        </a>{" "}
        for a list of faucets. || Weekly Payouts: 5x per IP &amp; 1x per
        Account.
      </p>
    </Container>
  );
}
