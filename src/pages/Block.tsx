import React, { useEffect } from "react";
import styled from "@emotion/styled";
import { Link, useParams } from "react-router-dom";

import { useBlockInfo } from "../api";
import { Indicator } from "../components/Indicator";
import { Properties, PropertiesItem } from "../components/Properties";
import { Account } from "../components/Account";
import { RawToMega } from "../utils";
import { RawToUSD } from "../components/IntlNumber";
import dayjs from "dayjs";
import { Card } from "../components/Card";

const Container = styled.main`
  padding: 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 3rem;
  grid-gap: 1rem;
  flex: 1;

  h2 {
    grid-column: 1 / 3;
  }

  @media (max-width: 540px) {
    grid-template-columns: 1fr;

    h2 {
      grid-column: 1;
    }
  }

  sub {
    font-size: 0.85em;
  }
`;

interface Params {
  hash: string;
}

export const BlockScreen: React.FC = () => {
  const { hash } = useParams<Params>();

  const blockInfoQuery = useBlockInfo(hash);

  const isSend = blockInfoQuery.data?.subtype === "send";
  const isReceive = blockInfoQuery.data?.subtype === "receive";
  const isChange = blockInfoQuery.data?.subtype === "change";
  const isEpoch = blockInfoQuery.data?.subtype === "epoch";

  useEffect(() => {
    document.title = `Nanocafe - ${hash}`;
  }, [hash]);

  return (
    <Indicator show={blockInfoQuery.isLoading}>
      <Container>
        <h2>{hash}</h2>
        <Properties as="section">
          <PropertiesItem label="Type:">
            {blockInfoQuery.data?.subtype}
            {!blockInfoQuery.data?.confirmed
              ? " (unconfirmed)"
              : blockInfoQuery.data?.pending
              ? " (pending)"
              : null}
          </PropertiesItem>
          <PropertiesItem label="Account:">
            <Account account={blockInfoQuery.data?.contents.account} />
          </PropertiesItem>
          {(isSend || isReceive) && (
            <PropertiesItem label="Amount:" big>
              <RawToMega amount={blockInfoQuery.data?.amount} /> <sub>NANO</sub>
            </PropertiesItem>
          )}
          <PropertiesItem label="Balance:" big>
            <RawToMega amount={blockInfoQuery.data?.balance} /> <sub>NANO</sub>
          </PropertiesItem>
          {isReceive ? (
            <PropertiesItem label="Sender:">
              <Account account={blockInfoQuery.data?.source_account} />
            </PropertiesItem>
          ) : isSend ? (
            <PropertiesItem label="Receiver:">
              <Account
                account={blockInfoQuery.data?.contents.link_as_account}
              />
            </PropertiesItem>
          ) : null}
          <PropertiesItem label="Representative:">
            <Account account={blockInfoQuery.data?.contents.representative} />
          </PropertiesItem>
          <PropertiesItem label="Block height:">
            {blockInfoQuery.data?.height}
          </PropertiesItem>
          <PropertiesItem label="Date:">
            {dayjs(blockInfoQuery.data?.local_timestamp).format("LLL")}
          </PropertiesItem>
          <PropertiesItem label="Previous block:">
            <Link to={`/${blockInfoQuery.data?.contents.previous}`}>
              {blockInfoQuery.data?.contents.previous}
            </Link>
          </PropertiesItem>
          <PropertiesItem label="Signature:">
            {blockInfoQuery.data?.contents.signature}
          </PropertiesItem>
          <PropertiesItem label="Work:">
            {blockInfoQuery.data?.contents.work}
          </PropertiesItem>
        </Properties>
        <Card as="pre">
          {JSON.stringify(blockInfoQuery.data, undefined, 2)}
        </Card>
      </Container>
    </Indicator>
  );
};
