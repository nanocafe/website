import styled from "@emotion/styled";
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";

import { useNodeTelemetry } from "../api";
import { Card } from "../components/Card";
import { Indicator } from "../components/Indicator";
import { IntlNumber } from "../components/IntlNumber";
import { Properties, PropertiesItem } from "../components/Properties";

const Container = styled.main`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  flex: 1;

  section {
    overflow: auto;
  }

  table {
    width: 100%;
    border-spacing: 0 0.25rem;
    border-collapse: separate;

    td,
    th {
      padding: 0.5rem;
      min-width: 150px;
    }
  }

  .right {
    text-align: right;
  }
`;

const SplitProperties = styled(Properties)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  column-gap: 1rem;
  border-left: none;
  background: none;
  padding: 0;

  @media (max-width: 540px) {
    & > div {
      margin: 0 -1rem;
    }
  }
`;

export default function NodeScreen () {
  const nodeTelemetryQuery = useNodeTelemetry();
  const lastBlocks = useRef(0);
  const lastTimestamp = useRef(new Date());
  const [tps, setTps] = useState(0);

  useEffect(() => {
    if (nodeTelemetryQuery.data?.block_count) {
      const { block_count, timestamp } = nodeTelemetryQuery.data;
      if (lastBlocks.current) {
        setTps(
          (((block_count - lastBlocks.current) * 1000) /
            (timestamp.getTime() - lastTimestamp.current.getTime())) *
            1000
        );
      }
      lastBlocks.current = block_count;
      lastTimestamp.current = timestamp;
    }
  }, [nodeTelemetryQuery.data?.block_count]);

  return (
    <Indicator show={nodeTelemetryQuery.isLoading || !nodeTelemetryQuery.data}>
      <Container>
        <h2>Node stats:</h2>
        <SplitProperties>
          <Card>
            <PropertiesItem label="TPS:" big>
              {tps ? tps.toFixed(2) : "..."}
            </PropertiesItem>
          </Card>
          <Card>
            <PropertiesItem label="Block count:" big>
              <IntlNumber number={nodeTelemetryQuery.data?.block_count ?? 0} />
            </PropertiesItem>
          </Card>
          <Card>
            <PropertiesItem label="Cemented count:" big>
              <IntlNumber
                number={nodeTelemetryQuery.data?.cemented_count ?? 0}
              />
            </PropertiesItem>
          </Card>
          <Card>
            <PropertiesItem label="Unchecked count:" big>
              <IntlNumber
                number={nodeTelemetryQuery.data?.unchecked_count ?? 0}
              />
            </PropertiesItem>
          </Card>
          <Card>
            <PropertiesItem label="Account count:" big>
              <IntlNumber
                number={nodeTelemetryQuery.data?.account_count ?? 0}
              />
            </PropertiesItem>
          </Card>
          <Card>
            <PropertiesItem label="Peer count:" big>
              <IntlNumber number={nodeTelemetryQuery.data?.peer_count ?? 0} />
            </PropertiesItem>
          </Card>
          <Card>
            <PropertiesItem label="Protocol version:" big>
              {nodeTelemetryQuery.data?.protocol_version}
            </PropertiesItem>
          </Card>
          <Card>
            <PropertiesItem label="Uptime:" big>
              {dayjs
                .duration(nodeTelemetryQuery.data?.uptime ?? 0, "seconds")
                .humanize()}
            </PropertiesItem>
          </Card>
          <Card>
            <PropertiesItem label="Version:" big>
              {nodeTelemetryQuery.data?.major_version}.
              {nodeTelemetryQuery.data?.minor_version}.
              {nodeTelemetryQuery.data?.patch_version}
              {nodeTelemetryQuery.data?.pre_release_version !== "0" &&
                `-rc.${nodeTelemetryQuery.data?.pre_release_version}`}
            </PropertiesItem>
          </Card>
          <Card>
            <PropertiesItem label="Active difficulty:" big>
              {nodeTelemetryQuery.data?.active_difficulty}
            </PropertiesItem>
          </Card>
        </SplitProperties>
      </Container>
    </Indicator>
  );
};
