import { css } from '@emotion/css';
import React from 'react';
import { TelemetryStream, useTelemetryStream } from '../api';
import { Indicator } from './Indicator';

const graph = css`
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }

  width: 100%;
  height: 100%;

  text {
    fill: black;
  }

  polygon {
    fill: none;
    stroke: black;
    stroke-width: 1px;
  }
`;

interface NodeProps {
  telemetry: TelemetryStream;
}

const Node: React.FC<NodeProps> = ({ telemetry }) => {
  return <polygon points="10,1 1,7.8 4,19.8 16,19.8 19,7.8" transform="scale(0.55)"/>
}

export const VisGraph: React.FC = () => {
  const telemetryQuery = useTelemetryStream();

  const levels = [];
  let no = 24;
  let copy = telemetryQuery.data?.slice() ?? [];
  while (copy.length > 0) {
    levels.push({ data: copy.splice(0, no), count: no });
    no += 12;
  }

  return <Indicator show={telemetryQuery.isLoading}>
    <svg className={graph}>
      { levels.map((level, i) => <g key={i} transform={`translate(300, 300) rotate(${360 / levels.length * i})`}>
        { level.data.map((telemetry, j) => <g
          key={telemetry.address + telemetry.port}
          transform={`rotate(${360 / level.data.length * j}) translate(${150 + i * 25 - level.count * 1}, 0) rotate(${360 / level.count * (-i + 3)})`}>
            <Node telemetry={telemetry}/>
        </g>) }
      </g>) }
      {/* { telemetryQuery.data?.map((telemetry, i) => <g key={telemetry.address + telemetry.port} transform={`translate(100, 100) rotate(${360 / telemetryQuery.data.length * i}, 200, 200)`}>
        <Node telemetry={telemetry}/>
      </g>) } */}
    </svg>
  </Indicator>;
}