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
     <Paragraph>Nano-Xmas is officially open, click <a href="https://xmas.nanos.cc/" target="_blank">here</a> to help fund a local charity and also experience Nano!</Paragraph>
    <Visualization/>
    <News/>
  </Container>;
};
