import {css} from '@emotion/css';
// import styled from '@emotion/styled';
import React, {useEffect, useRef, useState} from 'react';
// import {BsQuestionDiamond} from 'react-icons/bs';
// import {IoConstructOutline} from 'react-icons/io5';
import {AdvancedRealTimeChart} from "react-ts-tradingview-widgets";
import axios from 'axios';
import { subDays } from 'date-fns'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// const Container = styled.main`
//   flex: 1;
//
//   div {
//     margin-top: 1rem;
//     text-align: center;
//   }
// `;
// const Paragraph = styled.main`
//   color: #000;
//   text-align: center;
//   margin-top: 2rem;
//   font-size: 16px;
//   padding: 5px;
//   background-color: #F3695F;
// `;

const construction = css`

  padding: 3rem;
  //height: 600px;

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

  .under-construction-container {
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    margin-bottom: 2rem;
  }

  .finance-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 2rem;

    @media only screen and (max-width: 800px) {
      grid-template-columns: 1fr;
      grid-gap: 5rem;
    }

    .left-side {
      min-height: 20rem;
      //display: flex;
      //justify-content: stretch;
      //align-content: stretch;
    }

    .right-side {
      min-height: 30rem;
      text-align: center;
      //display: flex;
      //justify-content: stretch;
      //align-content: center;
    }
    
  }
`;



ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
        },
        title: {
            display: true,
            text: 'XNO Market Cap Chart',
        },
    },
};

export const FinanceScreen: React.FC = () => {

    const [data,setData] = useState<any>([]);

    let prev30Days: any = Array.from(Array(365).keys()).reverse();

    const d = new Date();

    prev30Days = prev30Days.map((val:any) => {
        const date = subDays(d,val);
        return date.toLocaleDateString()
    })

    console.log(prev30Days,'Prev 30 days')

    const chartData = {
        labels:prev30Days,
        datasets: [
            {
                label: 'XNO',
                data: data,
                // data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            }
        ]
    }

    //todo - fetch the data
    useEffect(() => {

        axios.get('https://api.coingecko.com/api/v3/coins/nano/market_chart?vs_currency=usd&days=364&interval=daily',{})
            .then(res => {
            console.log(res.data.market_caps);

            console.log(res,'response data')

            setData(res.data.market_caps)

        }).catch(err => {
            console.log(err.message);
        })

    },[])


    return (
        <div className={construction}>

            <div className={'under-construction-container'}>
                {/*<IoConstructOutline size="5rem" color="var(--primary)"/>*/}
                <h2>Under Construction</h2>
                <p>The Finance Page is currently under construction, expected to be released sometime February -
                    March 2022.</p>
            </div>

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

                    {/*<div>*/}
                        <Line height={210} options={options} data={chartData}/>
                    {/*</div>*/}
                </div>

            </div>
        </div>
    )
}