import { css } from '@emotion/css';
import styled from '@emotion/styled';
import React, { useEffect, useRef, useState } from 'react';
import { set, useForm, Controller } from 'react-hook-form';
import isNanoAddress from 'nano-address-validator';
import { GiTap } from 'react-icons/gi';
import { useFaucetMutation } from '../api';
import { Indicator } from '../components/Indicator';
import Loader from 'react-loader-spinner';
import { Link } from 'react-router-dom';
import { FaSearch, FaGlobe } from 'react-icons/fa';
import { Nanodrop } from '../components/Nanodrop';

const Container = styled.div`
  text-align: center;
  padding: 3rem .5rem;
  flex: 1;

  h2 {
    margin-top: 1rem;
    font-size: 2rem;
  }

  h3 {
    margin-top: 1rem;
    font-size: 1.50rem;
  }

  p {
    margin-top: 1rem;
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

    &:focus, &:hover {
      outline: none;
    }
  }

  .loading {
    margin-top: 1rem;
  }
`;

const ErrorMessageContainer = styled.div`
  margin-top: .5rem;
  color: red;
`;

export const FaucetScreen: React.FC = (props: any) => {

  return <Container>
    <GiTap size="5rem" color="var(--primary)" />
    
    <h2>Faucet</h2>
    
    <p>Experience Nano entirely free! First make a wallet <a href="https://natrium.io/" target="_blank">here</a> (mobile) or <a href="https://nault.cc" target="_blank">here</a> (desktop), then place your address below and enjoy!</p>
    
    <Nanodrop theme={props.theme} />
    <p>Click <a href="https://playnano.online/faucets" target="_blank">here</a> for a list of faucets.   ||   Weekly Payouts: 5x per IP &amp; 1x per Account.</p>
    
    <FaGlobe size="3rem" color="var(--primary)" />    
    <h3>Faucet Payout Map</h3>
    <iframe src="https://drop.nanocafe.cc/api/countries" width="940px" height="370"
      style={{position: "relative", border: 0, maxWidth: "100%", marginTop: 5, marginBottom: 5}} > \
    </iframe>
  </Container>
}
