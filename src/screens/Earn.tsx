import { css } from '@emotion/css';
import styled from '@emotion/styled';
import React from 'react';
import { BsQuestionDiamond } from 'react-icons/bs';
import { IoConstructOutline } from 'react-icons/io5';


const Container = styled.main`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, minmax(250px, auto));
  grid-row-gap: 1rem;
  width: 100%;
  margin: auto;
  background-color: #3C3939;
  @media (min-width: 600px) {
    .Banner {
      width: 50%;
    }
  }
  `;

const LargeBanner = styled.a`
  grid-column: 1/4;
  text-decoration: none;
  color: inherit;
  text-align: center;
  padding: 2rem;
  margin-top: 1rem;
  &:hover {
    /* background-color: #E0E0E0; you can change the color as you like */
  }

  img {
    max-width: 100%;
  }

  h2 {
    font-size: 2rem;
    margin-top: 1rem;
  }
`;

const SmallBanner = styled.a`
  grid-column: 1/4;
  text-decoration: none;
  color: inherit;
  text-align: center;
  padding: 2rem;

  &:hover {
    /* background-color: #E0E0E0; you can change the color as you like */
  }

  img {
    max-width: 100%;
  }

  h2 {
    font-size: 1.5rem;
    margin-top: 1rem;
  }
`;

export const EarnScreen: React.FC = () => {
  return (
    <Container>
      <LargeBanner class="Banner" href="https://xno.bet/" title="Available Now!">
        <img src={require('url:../../assets/febreward.png')} />
      </LargeBanner>
      <SmallBanner class="Banner">      <a href="https://playnano.online/?ref=nano_3odatubif8zuemhgtmdh465somyy9hmdeab6sa15od79cbdu79zgnndx7ozk" title="Affiliate Link">
        <img src={require('url:../../assets/newplaynano.png')} />
      </a></SmallBanner>

      <SmallBanner class="Banner"><a href="https://cryptovision.live" title="Cryptovision.live">
        <img src={require('url:../../assets/cvn.png')} />
      </a></SmallBanner>
    </Container>
  )
}
