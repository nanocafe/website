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
  const Paragraph = styled.main`
  color: #000;
  text-align: center;
  margin-top: 2rem;
  font-size: 16px;
  padding: 5px;
  background-color: #F3695F;
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

export const FinanceScreen: React.FC = () => {
  return <div className={construction}>
    <IoConstructOutline size="5rem" color="var(--primary)"/>
    <h2>Under Construction</h2>
    <p>The Finance Page is currently under construction, expected to be released sometime February - March 2022.</p>
  </div>
}