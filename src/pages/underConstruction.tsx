import { css } from '@emotion/css';
import React from 'react';
import { BsQuestionDiamond } from 'react-icons/bs';
import { IoConstructOutline } from 'react-icons/io5';

const construction = css`
  text-align: center;
  padding: 3rem;

  h2 {
    margin-top: 1rem;
    font-size: 2rem;
  }

  p {
    margin-top: 0.5rem;
  }
`;

export default function UnderConstruction () {
  return <div className={construction}>
    <IoConstructOutline size="5rem" color="var(--primary)"/>
    <h2>Under Construction</h2>
    <p>This page is under construction. Please check back later!</p>
  </div>
}