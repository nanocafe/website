import {css} from '@emotion/css';
import styled from '@emotion/styled';
import React, {useEffect, useRef} from 'react';
// import {BsQuestionDiamond} from 'react-icons/bs';
import {IoConstructOutline} from 'react-icons/io5';
import {AdvancedRealTimeChart} from "react-ts-tradingview-widgets";


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

  padding: 3rem;
  height: 600px;

  @media only screen and (max-width: 600px) {
    padding: 1rem;
  }

  @media only screen and (max-width: 500px) {
    padding: .5rem;
  }

  h2 {
    margin-top: 1rem;
    font-size: 2rem;
  }

  p {
    margin-top: 0.5rem;
  }

  .finance-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 1rem;

    @media only screen and (max-width: 800px) {
      grid-template-columns: 1fr;
    }

    .left-side {
      min-height: 30rem;
    }

    .right-side {
      min-height: 30rem;
      text-align: center;
      display: flex;
      justify-content: center;
      align-content: center;
    }
  }



`;

export const FinanceScreen: React.FC = () => {

    return (
        <div className={construction}>

            <div className="finance-container">

                {/* Left side*/}
                <div className={'left-side'}>
                    <AdvancedRealTimeChart
                        locale={'en'}
                        timezone={'Etc/UTC'}
                        interval={'60'}
                        symbol={'BINANCE:XNOUSDT'}
                        theme="dark"
                        autosize
                        hide_side_toolbar={true}
                        // toolbar_bg={'#f1f3f6'}
                        enable_publishing={false}
                        style={'1'}
                        // watchlist={["BINANCE:XNOETH",
                        //     "BINANCE:XNOBTC",
                        //     "BITHUMB:XNOKRW",
                        //     "BINANCE:XNOUSDT"
                        // ]}
                        // calendar={true}
                        container_id={'tradingview_1904b'}
                    />

                </div>

                {/* Right Side*/}
                <div className={'right-side'}>
                    {/*<AdvancedRealTimeChart theme="dark" autosize/>*/}
                    <div>
                        <IoConstructOutline size="5rem" color="var(--primary)"/>
                        <h2>Under Construction</h2>
                        <p>The Finance Page is currently under construction, expected to be released sometime February -
                            March 2022.</p>
                    </div>

                </div>

            </div>
        </div>
    )
}