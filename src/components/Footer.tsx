import React from 'react';
import { Donate } from './Donate';
import dayjs from 'dayjs';
import { css } from '@emotion/css';
import { useMediaQuery } from 'react-responsive'
import {
    FaEnvelopeSquare,
    FaRedditSquare,
    FaRunning,
    FaGithub,
    FaMoon, FaSun
} from 'react-icons/fa';
import { useTheme } from '@/contexts/Theme';
import Link from 'next/link';

const footer = css`
  background: var(--header);
  border-top: 1px solid var(--primary-border);
  padding: 1rem;
  row-gap: 0.5rem;
  display: flex;
  line-height: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;

  & > div {
    flex: 1;
    text-align: left;
  }

  & > main {
    width: 100%;
    text-align: center;
  }

  a, button {
      color: var(--primary);
      margin: 0 6px;
  }

  a:hover, button:hover {
      color: var(--hover);
  }

  button.modeToggle {
    color: var(--primary);
    padding: 0;
    margin: 10px 0 20px;
    &:hover {
      color: var(--hover);
      cursor: pointer;
    }
  }

  @media (max-width: 540px) {
    padding: 0.5rem;
    flex-direction: column;

    & > div {
        display: block;
      text-align: center !important;
    }

    & > main {
      order: 2;
    }
    .donate {
      display: block;
      text-align: center;
      order: 1;
    }
  }
`;

export default function Footer () {

    const { isDark, toggle: setDark } = useTheme();

    const isSmallerThan600 = useMediaQuery({
        query: '(max-width: 600px)'
    })

    return <footer className={footer}>
        <div style={{ textAlign: 'right' }}>
            <Link href="/node">Node Info</Link>
        </div>
        <div style={{ textAlign: 'center' }}>
            <a href="https://nano.community/introduction/basics" target="_blank" rel="noreferrer noopener">What is Nano?</a>
        </div>
        <Donate />
        <main>
            {
                isSmallerThan600 && (
                    isDark ? (
                        <button className={"modeToggle"} onClick={setDark}>
                            <FaMoon size={25} />
                        </button>
                    ) : (
                        <button className={"modeToggle"} onClick={setDark}>
                            <FaSun size={25} />
                        </button>

                    )
                )

            }
            <p style={{ display: 'flex', justifyContent: 'center', alignItems: "center" }}>

                <a href="mailto:saizo@nanocafe.cc" target="_blank" rel="noreferrer noopener" title="Contact">
                    <FaEnvelopeSquare size="2rem" />
                </a>
                <a href="https://www.reddit.com/r/nanocurrency" target="_blank" rel="noreferrer noopener" title="/r/nanocurrency">
                    <FaRedditSquare size="2rem" />
                </a>
                <a href="https://nanolooker.com" target="_blank" rel="noreferrer noopener" title="Adv. Explorer">
                    <FaRunning size="2rem" />
                </a>
                <a href="https://github.com/nanocafe" target="_blank" rel="noreferrer noopener" title="Github nanocafe repository">
                    <FaGithub size="2rem" />
                </a>
            </p>
            <p style={{ fontSize: 10, marginTop: 20, opacity: .7 }}>
            Copyright &copy; {dayjs().get('year')} Nanocafe.cc
            <a href="https://nanocafe.cc/privacy" target="_blank">Privacy Policy</a>
            <a href="https://nanocafe.cc/terms" target="_blank">Terms of Use</a>
            </p>
            
        </main>
    </footer>

}
