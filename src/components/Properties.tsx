import React from 'react';
import styled from '@emotion/styled';

import { Card } from './Card';


export const Properties = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  & > div {
    display: flex;
    flex-direction: column;

    strong {
      font-weight: 300;
    }

    div {
      margin: 0.35rem 0 1rem;

      &.big {
        font-size: 1.2rem;
      }

      &:last-of-type {
        margin-bottom: 0;
      }
    }
  }
`;

interface ItemProps {
  label: string;
  big?: boolean;
}

export const PropertiesItem: React.FC<ItemProps> = ({ label, big, children }) => {
  return <div>
    <strong>{ label }</strong>
    <div className={big ? 'big' : undefined}>
      { children }
    </div>
  </div>;
};