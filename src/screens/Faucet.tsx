import { css } from '@emotion/css';
import styled from '@emotion/styled';
import React, {useRef, useState} from 'react';
import {set, useForm,Controller} from 'react-hook-form';
import isNanoAddress from 'nano-address-validator';
import { GiTap } from 'react-icons/gi';
import { useFaucetMutation } from '../api';
import { Indicator } from '../components/Indicator';
import Loader from 'react-loader-spinner';
import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import ReCAPTCHA from "react-google-recaptcha";
import { Nanodrop, useScript } from '../components/Nanodrop';

const Container = styled.div`
  text-align: center;
  padding: 3rem .5rem;
  flex: 1;

  h2 {
    margin-top: 1rem;
    font-size: 2rem;
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

const RecaptchaContainer = styled.div`
  display: flex;
  margin-top: 1rem;
  justify-content: center;
  align-content: center;
  align-items: center;
`;

const ErrorMessageContainer = styled.div`
  margin-top: .5rem;
  color: red;
`;

interface Form {
  address: string;
  recaptcha: boolean;
}

export const FaucetScreen: React.FC = (props) => {

  return <Container>
    <GiTap size="5rem" color="var(--primary)"/>
    <h2>Faucet</h2>
    <Nanodrop theme={props.theme}/>
  </Container>
}
