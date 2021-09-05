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

const Container = styled.div`
  text-align: center;
  padding: 3rem;
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

export const FaucetScreen: React.FC = () => {

  const { register, reset,control, handleSubmit, formState: { errors, isValid } } = useForm<Form>({
    defaultValues: {
      address: '',
    },
  });

  console.log(errors)

  const faucetMutation = useFaucetMutation();
  const recaptchaRef = useRef<ReCAPTCHA>();

  function onSubmit(values: Form) {
    console.log('onsubmit is called')
    faucetMutation.mutate(values.address);
    reset();
  }

  function onChange(value: any) {
    console.log("Captcha value:", value);
  }

  return <Container>
    <GiTap size="5rem" color="var(--primary)"/>
    <h2>Faucet</h2>
    { faucetMutation.isLoading ? <div className="loading">
      <Loader
        type="MutatingDots"
        color="var(--primary)"
        secondaryColor="var(--nano)"
        height={100}
        width={100}/>
    </div> : faucetMutation.isSuccess ? <>
      <p>Your payout is being processed, you should receive it shortly!</p>
    </> : faucetMutation.isError ? <>
      <p>We only support one-time payment through this faucet, our system indicates you've already received Nano.</p>
    </> : <>
      <p>Experience Nano entirely free! Make a Nano wallet <a href="https://nault.cc/configure-wallet" rel="noreferrer noopener" target="_blank">here </a>(desktop) or <a href="https://natrium.io" rel="noreferrer noopener" target="_blank">here </a>(mobile) and enter your address below to receive 0.0000133 Nano.</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          className={[ errors.address ? 'invalid' : '',  ].join(' ')}
          type="text"
          placeholder="Enter your nano address here"
          { ...register(
            'address',
            {
              required: {
                value: true,
                message: "You must have to specify your nano address"
              },
              validate(value) {
                return isNanoAddress(value, ['nano', 'xrb']) && value !== process.env.NODE_ADDRESS;
              }
            }
          )}/>
        <button >
          <FaSearch/>
        </button>


          {errors.address && (
              <ErrorMessageContainer>
                Invalid Address
              </ErrorMessageContainer>
          )}


        <RecaptchaContainer>
          <Controller
              control={control}
              name="recaptcha"
              rules={{
                required: {
                  value: true,
                  message: 'You must complete the Google Recaptcha to claim the reward!',
                }
              }}
              render={({
                         field: { onChange, onBlur, value, name, ref },
                         fieldState: { invalid, isTouched, isDirty, error },
                         formState,
                       }) => (
                  <ReCAPTCHA
                      sitekey="6LfUTnkbAAAAAJXo-g0Op4aVol-j-PdLag9B1POg"
                      onChange={onChange}
                  />
              )}
          />
        </RecaptchaContainer>

        {
          errors.recaptcha && (
              <ErrorMessageContainer>
                {errors.recaptcha.message}
              </ErrorMessageContainer>
          )
        }

      </form>
    </> }
  </Container>
}
