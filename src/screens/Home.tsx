import { css } from '@emotion/css';
import styled from '@emotion/styled';
import React from 'react';
import { News } from '../components/News';
import { VisGraph } from '../components/VisGraph';
import { Visualization } from '../components/Visualization';

const Container = styled.main`
  flex: 1;
  
  div {
    margin-top: 1rem;
    text-align: center;
  }
`;
 const Paragraph = styled.main`
  color: #000;
  text-align: center;
  margin-top: 2rem;
  font-size: 16px;
  padding: 5px;
  background-color: #F3695F;
`; 

export const HomeScreen: React.FC = () => {
  return <Container>
    <Paragraph>Ticker data is currently not reflecting xno/usdt & xno/btc market rates due to reliance on the binance api, they will be updated ASAP to reflect market rates once binance completes their ticker change maintenance for nano/xno by 1/28.</Paragraph>
    <Visualization/>
    <News/>
  </Container>;
};
