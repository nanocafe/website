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

export const HomeScreen: React.FC = () => {
  return <Container>
<p style="background-color:#FF0000; color: #FFFFFF; text-align:center; font-weight:light;">Nanocafe EOM beta release information coming soon!</p>
    <Visualization/>
    <News/>
  </Container>;
};
