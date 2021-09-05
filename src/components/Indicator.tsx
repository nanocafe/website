import { css } from '@emotion/css';
import React from 'react';
import Loader from 'react-loader-spinner';

interface Props {
  show: boolean;
}

const loader = css`
  position: absolute;
  width: 100%;
  padding: 2rem;
  margin-top: 5rem;
  box-sizing: border-box;
  text-align: center;
`;

export const Indicator: React.FC<Props> = ({ show, children }) => {
  if (!show) {
    return <>{ children }</>;
  }

  return <>
    <div style={{flex: 1}}/>
    <div className={loader}>
      <Loader
        type="MutatingDots"
        color="var(--primary)"
        secondaryColor="var(--nano)"
        height={100}
        width={100}/>
    </div>
  </>;
};