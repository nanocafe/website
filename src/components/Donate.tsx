import styled from '@emotion/styled';
import React, {useEffect, useState} from 'react';

import qrDonate from 'url:../../assets/qr_donate.svg';
import qrRep from 'url:../../assets/qr_rep.svg';
import {Account} from './Account';
import {FaCopy} from 'react-icons/fa';
import toast, {Toaster} from 'react-hot-toast';

const Container = styled.div`
  text-align: right;

  & > button {
    cursor: pointer;
    font-size: 1rem;
    color: var(--nano);
    text-align: right;
    padding: 0;
  }

  p {
    padding: 0.5rem;
  }

  main {
    text-align: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.1);
    z-index: 10004;
    display: none;
    align-items: center;

    @media (prefers-color-scheme: dark) {
      background: rgba(0, 0, 0, 0.5);
    }

    &.active {
      display: flex;
    }

    section {
      padding: 1rem;
      border: 1px solid var(--primary-border);
      background: var(--bg);
      width: 20rem;
      margin: auto;
      display: flex;
      flex-direction: column;

      article {
        flex-direction: column;
        display: none;

        &.active {
          display: flex;
        }
      }

      img {
        max-height: 20rem;
      }

      & > div {
        text-align: left;
        background: var(--header);
        margin-left: -1rem;
        margin-top: -1rem;
        width: 100%;
        padding: 1rem;
        padding-bottom: 0;
        border-bottom: 1px solid var(--primary-border);

        button {
          cursor: pointer;
          font-size: 1.2rem;
          color: var(--nano);
          padding-bottom: 1rem;
          box-sizing: border-box;
          margin: 0;

          &.active {
            border-bottom: 2px solid var(--primary);
          }
        }
      }
    }
  }
`;

enum Option {
    DONATE,
    SET_REP,
}

const notify = () => toast.success('Address Copied');

export const Donate: React.FC = () => {
    const [active, setActive] = useState(false);
    const [option, setOption] = useState<Option>(Option.DONATE);

    function hideDonationPanel(e: React.MouseEvent<HTMLElement, MouseEvent>) {
        if ((e.target as HTMLElement).tagName === 'MAIN') {
            setActive(false);
        }
    }

    const copyToClipBoardHandler = (address: string) => {
        navigator.clipboard.writeText(address)
            .then(() => {
                notify();
                console.log('Address is copied')
            })
    }


    return <Container className="donate">
        <button onClick={() => setActive(true)}>Donate / Set Representative</button>
        <main className={active ? 'active' : undefined} onClick={hideDonationPanel}>
            <section>
                <div>
                    <button onClick={() => setOption(Option.DONATE)}
                            className={option === Option.DONATE ? 'active' : undefined}>Donate
                    </button>
                    <button onClick={() => setOption(Option.SET_REP)}
                            className={option === Option.SET_REP ? 'active' : undefined}>Set representative
                    </button>
                </div>
                <article className={option === Option.DONATE ? 'active' : undefined}>
                    <p>Donate to Nanocafe.cc:</p>
                    <img src={qrDonate} alt={'donate'}/>
                    <div style={{display: 'flex',alignItems: "center"}}>
                        <a href="nano://nano_1zj4y7h4xd5b7qu9se7t3y8p9647b1udkpg5yc6i96onkcxzhh57uubzmupi?label=nanocafe.cc">
                            nano_1zj4y7h4xd5b7qu9se7t3y8p9647b1udkpg5yc6i96onkcxzhh57uubzmupi
                        </a>
                        <FaCopy size={35} onClick={() => {
                            copyToClipBoardHandler('nano_1zj4y7h4xd5b7qu9se7t3y8p9647b1udkpg5yc6i96onkcxzhh57uubzmupi')
                        }} style={{marginLeft: '1rem'}}/>
                    </div>
                </article>
                <article className={option === Option.SET_REP ? 'active' : undefined}>
                    <p>Set your representative to Nanocafe.cc:</p>
                    <img src={qrRep}/>
                  <div style={{display: 'flex',alignItems: "center"}}>
                    <a href="#">
                        nano_1cafe95a81ko3mq3oin4wnubsbw9z3w3tw5a95u47897wxy96r1zj9hxu1wb
                    </a>
                       <FaCopy size={35} onClick={() => {
                            copyToClipBoardHandler('nano_1cafe95a81ko3mq3oin4wnubsbw9z3w3tw5a95u47897wxy96r1zj9hxu1wb')
                        }} style={{marginLeft: '1rem'}}/>
                  </div>
                </article>
            </section>
        </main>
    </Container>;
}
