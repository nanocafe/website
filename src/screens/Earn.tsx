import { css } from '@emotion/css';
import styled from '@emotion/styled';
import React from 'react';
import { BsQuestionDiamond } from 'react-icons/bs';
import { IoConstructOutline } from 'react-icons/io5';


const Container = styled.main`
  flex: 1;
  
  div {
    margin-top: 1rem;
    text-align: center;
  }
`;

const construction = css`
  text-align: center;
  padding: 3rem;
  height: 600px;
  h2 {
    margin-top: 1rem;
    font-size: 2rem;
  }

  p {
    margin-top: 0.5rem;
  }
`;

export const EarnScreen: React.FC = () => {
  return <div className={construction}>
    <IoConstructOutline size="5rem" color="var(--primary)"/>
    <h2>Under Construction</h2>
    <p>The Earn Page is currently under construction, expected to be released sometime February - March 2022.</p>
  </div>
}