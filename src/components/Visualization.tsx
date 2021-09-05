import styled from '@emotion/styled';
import React, { useEffect, useRef, useState } from 'react';
import { Transaction, useTransactions } from '../api';
import { BiCoffeeTogo } from 'react-icons/bi';
import { SiBuymeacoffee } from 'react-icons/si';
import { safeRawToMega } from '../utils';
import { Link } from 'react-router-dom';

const Container = styled.div`
  padding: 0.5rem;
  display: flex;
  flex-direction: column;

  & > div {
    flex: 1;
    min-height: 120px;
    max-height: 400px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  
    @keyframes enterexit {
      0% {
        opacity: 0;
      }
  
      25% {
        opacity: 1;
      }
  
      75% {
        opacity: 1;
      }
  
      100% {
        opacity: 0;
      }
    }
  
    .tx {
      animation-name: enterexit;
      animation-duration: 4s;
    }
  }

  details, summary {
    text-align: left;
    outline: none;
  }

  summary {
    cursor: pointer;
    margin-bottom: 0.5rem;
  }

  legend {
    text-align: left;
    // padding: 1rem;
    line-height: 1.5;
    font-size: 0.9rem;

    @media (max-width: 540px) {
      padding: 0;
    }
  }

  p, p li {
    word-break: normal;
    overflow-wrap: normal;
  }
`;

export const Visualization: React.FC = () => {
  const [ transactionTimestamp, setTransactionTimestamp ] = useState(Date.now() - 1000 * 60);
  const transactionCache = useRef<Transaction[]>([]);
  const transactionsQuery = useTransactions((transactions) => {
    const lastValue = transactionCache.current[transactionCache.current.length - 1];
    const sorted = [ ...transactions ].filter((v) => !transactionCache.current.find((tx) => tx.link === v.link)).sort((a, b) => a.time.getTime() - b.time.getTime());

    if (!lastValue) {
      transactionCache.current = sorted;
      return;
    }

    transactionCache.current.push(...sorted.filter((val) => val.time.getTime() > lastValue.time.getTime()));
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const t = Date.now() - 60 * 1000;
      setTransactionTimestamp(t);

      transactionCache.current = transactionCache.current.filter((tx) => tx.time.getTime() > t - 1000 * 4);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const filtered = transactionCache.current.filter(
    (tx) => tx.time.getTime() > transactionTimestamp && tx.time.getTime() < transactionTimestamp + 1000 * 4,
  );

  return <Container>
    <h2>Live network visualization:</h2>
    <div>
      { filtered?.map((tx) => <div className="tx" key={tx.link}>
        { (tx.subtype === 'send' || tx.subtype === 'receive')
            ? <BiCoffeeTogo size={`${ Math.min(5, Math.max(0.75, Math.log10(parseFloat(safeRawToMega(tx.amount))))) }rem`}/>
            : <SiBuymeacoffee />
        }
      </div>) }
    </div>
    <details>
      <summary>Legend</summary>
      <legend>
        <ul>
          <li><BiCoffeeTogo /> - Nano transaction, size depends on the transaction amount</li>
          <li><SiBuymeacoffee /> - representative change</li>
        </ul>
        Transactions are cached and displayed here with a minute delay.
      </legend>
    </details>
  </Container>;
}
