import { css } from '@emotion/css';
import styled from '@emotion/styled';
import React from 'react';
import { BsQuestionDiamond } from 'react-icons/bs';
import { IoConstructOutline } from 'react-icons/io5';


const Container = styled.main`
  flex: 1;
  
  div {
    margin-top: 1rem;
    text-align: left;
  }
`;

const earnDesign = css`
  text-align: left;
  padding: 3rem;
  height: 600px;
  h2 {
    margin-top: 1rem;
    font-size: 2rem;
  }
  img {
  max-width: 100%;
  }
`;

export const EarnScreen: React.FC = () => {
  return <div className={earnDesign}>
      
      
   <a href="https://playnano.online/?ref=nano_3odatubif8zuemhgtmdh465somyy9hmdeab6sa15od79cbdu79zgnndx7ozk" title="Affiliate Link">
     <img src={require('url:../../assets/playnano.png')} />
   </a>


  </div>
}