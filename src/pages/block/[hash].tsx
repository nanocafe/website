import React, { useEffect } from "react";
import styled from "@emotion/styled";

import { getBlockInfo } from "../../api";
import { Indicator } from "../../components/Indicator";
import { Properties, PropertiesItem } from "../../components/Properties";
import { Account } from "../../components/Account";
import { RawToMega, isBlockHash } from "../../utils";
import dayjs from "dayjs";
import { Card } from "../../components/Card";
import { useRouter } from "next/router";
import Link from "next/link";
import { useQuery } from "react-query";

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

export default function BlockScreen() {
  const { query } = useRouter();

  const { hash } = query;

  const { data, isLoading } = useQuery(["block_info", hash], () => getBlockInfo(hash as string), {
    enabled: typeof hash === "string" && isBlockHash(hash),
  })


  const isSend = data?.subtype === "send";
  const isReceive = data?.subtype === "receive";
  const isChange = data?.subtype === "change";
  const isEpoch = data?.subtype === "epoch";

  useEffect(() => {
    document.title = `Nanocafe - ${hash}`;
  }, [hash]);

  if (typeof hash !== "string" || !isBlockHash(hash)) {
    return (
      <Indicator>
        <main>
          <h2>Invalid Address</h2>
        </main>
      </Indicator>
    );
  }

  return (
    <Indicator show={isLoading}>
      <Container>
        <h2>{hash}</h2>
        <Properties as="section">
          <PropertiesItem label="Type:">
            {data?.subtype}
            {!data?.confirmed
              ? " (unconfirmed)"
              : data?.pending
              ? " (pending)"
              : null}
          </PropertiesItem>
          <PropertiesItem label="Account:">
            <Account account={data?.contents.account} />
          </PropertiesItem>
          {(isSend || isReceive) && (
            <PropertiesItem label="Amount:" big>
              <RawToMega amount={data?.amount} /> <sub>NANO</sub>
            </PropertiesItem>
          )}
          <PropertiesItem label="Balance:" big>
            <RawToMega amount={data?.balance} /> <sub>NANO</sub>
          </PropertiesItem>
          {isReceive ? (
            <PropertiesItem label="Sender:">
              <Account account={data?.source_account} />
            </PropertiesItem>
          ) : isSend ? (
            <PropertiesItem label="Receiver:">
              <Account
                account={data?.contents.link_as_account}
              />
            </PropertiesItem>
          ) : null}
          <PropertiesItem label="Representative:">
            <Account account={data?.contents.representative} />
          </PropertiesItem>
          <PropertiesItem label="Block height:">
            {data?.height}
          </PropertiesItem>
          <PropertiesItem label="Date:">
            {dayjs(data?.local_timestamp).format("LLL")}
          </PropertiesItem>
          <PropertiesItem label="Previous block:">
            <Link href={`/${data?.contents.previous}`}>
              {data?.contents.previous}
            </Link>
          </PropertiesItem>
          <PropertiesItem label="Signature:">
            {data?.contents.signature}
          </PropertiesItem>
          <PropertiesItem label="Work:">
            {data?.contents.work}
          </PropertiesItem>
        </Properties>
        <Card as="pre">
          {JSON.stringify(data, undefined, 2)}
        </Card>
      </Container>
    </Indicator>
  );
}
