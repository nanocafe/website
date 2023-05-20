import { css } from "@emotion/css";
import React, { useEffect, useState } from "react";
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";
import axios from "axios";
import { subDays } from "date-fns";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
// @ts-ignore
import { Currencies } from "../components/Currencies";

const construction = css`
  padding: 3rem;

  @media only screen and (max-width: 600px) {
    padding: 1rem;
  }

  @media only screen and (max-width: 500px) {
    padding: 0.5rem;
  }

  h2 {
    margin-top: 1rem;
    font-size: 2rem;
  }

  p {
    margin-top: 0.5rem;
  }
  .currencies-container h1 {
    margin-top: 1.5rem;
    @media only screen and (min-width: 600px) {
      margin-top: 0px;
    }
  }

  .under-construction-container {
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    margin-bottom: 2rem;
  }

  .charts-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 2rem;

    @media only screen and (max-width: 800px) {
      grid-template-columns: 1fr;
      grid-gap: 5rem;
    }

    .left-side {
      min-height: 20rem;
      width: 100%;
    }

    .right-side {
      min-height: 30rem;
      text-align: center;
      width: 100%;
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
      position: "top" as const,
    },
    title: {
      display: true,
      text: "XNO Market Cap Chart",
    },
  },
};

export default function ChartsScreen() {
  const [data, setData] = useState<any>([]);

  let prev30Days: any = Array.from(Array(365).keys()).reverse();

  const d = new Date();

  prev30Days = prev30Days.map((val: any) => {
    const date = subDays(d, val);
    return date.toLocaleDateString();
  });

  console.log(prev30Days, "Prev 30 days");

  const chartData = {
    labels: prev30Days,
    datasets: [
      {
        label: "XNO",
        data: data,
        // data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  //todo - fetch the data
  useEffect(() => {
    axios
      .get(
        "https://api.coingecko.com/api/v3/coins/nano/market_chart?vs_currency=usd&days=364&interval=daily",
        {}
      )
      .then((res) => {
        console.log(res.data.market_caps);

        console.log(res, "response data");

        setData(res.data.market_caps);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  return (
    <div className={construction}>
      <div className="currencies-container">
        <h1 style={{ fontSize: "1.2rem" }}>XNO Currency Pairs</h1>
        <Currencies />
      </div>
      <div className="charts-container">
        {/* Left side*/}
        <div className={"left-side"}>
          <AdvancedRealTimeChart
            locale={"en"}
            timezone={"Etc/UTC"}
            interval={"60"}
            symbol={"BINANCE:XNOUSDT"}
            theme="dark"
            autosize
            hide_side_toolbar={true}
            // toolbar_bg={'#f1f3f6'}
            enable_publishing={false}
            style={"1"}
            // watchlist={["BINANCE:XNOETH",
            //     "BINANCE:XNOBTC",
            //     "BITHUMB:XNOKRW",
            //     "BINANCE:XNOUSDT"
            // ]}
            // calendar={true}
            container_id={"tradingview_1904b"}
          />
        </div>

        {/* Right Side*/}
        <div className={"right-side"}>
          {/*<div>*/}
          <Line height={210} options={options} data={chartData} />
          {/*</div>*/}
        </div>
      </div>
    </div>
  );
}
