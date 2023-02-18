import { css } from '@emotion/css';
import styled from '@emotion/styled';
import React, { useState, useEffect } from 'react';

const Container = styled.main`
  margin: auto;
  width: 100%;
`;

const Banner = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto 1fr auto;
  width: 100%;
  max-width: 70%;
  margin: 2% auto;
  padding: 2%;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  transition: box-shadow 0.2s ease-in-out;
  background-color: #152445;
  &:hover {
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.4);
  }
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 70px;
  height: 70px;
  background-color: #4a4a4a;
  border-radius: 50%;
  margin-left: -15px;
`;
const textContainer = styled.div`
  padding-left: 5px;

`;
const Icon = styled.img`
  width: 50%;
  height: 50%;
`;

const Title = styled.h2`
padding-left: 5px;
  font-size: 2rem;
  font-weight: bold;
  color: white;
  margin-top: 0;
`;

const Subtitle = styled.h3`
padding-left: 5px;
  font-size: 1.2rem;
  color: #308a08;
  margin-top: 0;
`;

const Description = styled.p`
padding-left: 5px;
  font-size: 1rem;
  color: white;
  margin-bottom: 0;
`;

const Button = styled.a`
  display: block;
  width: fit-content;
  padding: 10px 20px;
  background-color: #4778E9;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  margin-left: auto;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #2864ff;
  }
`;

export const EarnScreen: React.FC = () => {

  return (
    <Container>
      <Banner>
        <IconContainer>
          <Icon src="https://xno.bet/icons/logo.png" />
        </IconContainer>
        <div>
          <Title>XNO.BET</Title>
          <Subtitle>Monthly high reward 20+XNO available for less than 0.07XNO entry</Subtitle>
          <Description>
          Make a guess on what the price of XNO will be at the end of the month and if you get it closest or exact, you win!
          </Description>
          <Button href="https://xno.bet/" target="_blank" title="By clicking this you are exiting the website and entering a 3rd party site.">Enter</Button>
        </div>
      </Banner>
      <Banner>
        <IconContainer>
          <Icon src="https://playnano.online/favicon-96x96.png" />
        </IconContainer>
        <div className='textContainer'>
          <Title>PlayNano</Title>
          <Subtitle></Subtitle>
          <Description>
          See why Nano is the best cryptocurrency, with feeless and instant use cases.
Earn, play, bet, and spend - no account or login required.
          </Description>
          <Button href="https://playnano.online/?ref=nano_3odatubif8zuemhgtmdh465somyy9hmdeab6sa15od79cbdu79zgnndx7ozk" target="_blank">Enter</Button>
        </div>
      </Banner>
      <Banner>
        <IconContainer>
          <Icon src="https://xno.ai/assets/favicon-32x32.png"/>
        </IconContainer>
        <div>
          <Title>XNO.AI</Title>
          <Subtitle></Subtitle>
          <Description>
            xno.ai is an eco-friendly alternative to proof-of-work mining. Instead of hashing, workers use AI to generate data. Workers are awarded for their contributions. Although we use the term 'mining,' no actual mining of cryptocurrency takes place.
          </Description>
          <Button href="https://xno.ai?ref=Nanocafe" target="_blank">Enter</Button>
        </div>
      </Banner>
      <Banner>
        <IconContainer>
          <Icon src="https://cryptovision.live/favicon.png" />
        </IconContainer>
        <div>
          <Title>Cryptovision.live</Title>
          <Subtitle></Subtitle>
          <Description>
          CryptoVision is a crypto-centric video sharing platform where the rewards are just a bonus. Visionaries queue YouTube videos and the community watches the ever-evolving playlist together. Earn XNO for watching queued videos as an additional reward.
          </Description>
          <Button href="https://cryptovision.live/" target="_blank">Enter</Button>
        </div>
      </Banner>

    </Container>
  );
};