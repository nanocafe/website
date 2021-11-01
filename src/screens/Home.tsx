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
  color: #FFF;
  text-align: center;
  margin-top: 2rem;
  font-size: 16px;
  font-weight: bold;
  padding: 5px;
  background-color: #f44336;
`;
export const HomeScreen: React.FC = () => {
  return <Container>
    <Paragraph>Nanocafe EOM Beta will be released Nov. 8th, entries will be open 11/08 - 11/10</Paragraph>
    <Visualization/>
    <News/>
  </Container>;
};
