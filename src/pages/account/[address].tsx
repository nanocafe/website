import { css } from "@emotion/css";
import dayjs from "dayjs";
import React, { useEffect } from "react";
import isNanoAddress from "nano-address-validator";
import {
  useAccountHistory,
  useAccountInfo,
  useAliases,
  useConfirmationQuorum,
  useMNNAccount,
  usePending,
} from "../../api";
import { Card } from "../../components/Card";
import { Indicator } from "../../components/Indicator";
import { RawToUSD } from "../../components/IntlNumber";
import { Properties, PropertiesItem } from "../../components/Properties";
import { RawToMega, safeRawToMega } from "../../utils";
import { FaCopy } from "react-icons/fa";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import Link from "next/link";

const account = css`
  padding: 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 3rem;
  grid-gap: 1rem;
  flex: 1;

  @media (max-width: 780px) {
    grid-template-columns: 1fr;

    h2 {
      order: 1;
    }
    section {
      order: 2;
    }
    h3 {
      order: 3;
    }
    ul {
      order: 4;
    }
  }

  & > section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  sub {
    font-size: 0.85em;
  }

  ul {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;

    li {
      padding: 0.5rem;
      border-left: 3px solid var(--primary-border);
      background: linear-gradient(
        90deg,
        var(--primary-transparent),
        rgba(0, 0, 0, 0)
      );
      /* border-radius: 1px; */
      /* background: radial-gradient(ellipse at left top, var(--primary-transparent), rgba(0,0,0,0)),
  radial-gradient(ellipse at right bottom, var(--primary-transparent), rgba(0,0,0,0)); */
      display: grid;
      grid-template-columns: 4rem 1fr 15rem;
      gap: 0.5rem;

      @media (max-width: 540px) {
        grid-template-columns: 4rem 1fr;
        margin: 0 -1rem;
        padding: 1rem;
      }

      line-height: 1rem;

      strong {
        font-family: var(--font-mono);
        font-size: 0.9rem;

        @media (max-width: 540px) {
          grid-column: 1 / 3;
        }
      }

      &.send {
        strong {
          color: var(--red);
        }
      }
      &.receive {
        strong {
          color: var(--green);
        }
      }

      span.date {
        text-align: right;
      }

      a {
        grid-column: 1 / 4;

        @media (max-width: 540px) {
          grid-column: 1 / 3;
        }

        &.hash {
          font-family: var(--font-mono);
          font-size: 0.9rem;
        }
      }
    }
  }
`;

const notify = () => toast.success("Address Copied");

export default function AccountScreen() {
  const { query } = useRouter();

  const { address: _address } = query;

  const address = _address as string || '';

  const accountInfoQuery = useAccountInfo(address);
  const mnnAccountQuery = useMNNAccount(address);
  const nodeAccountInfoQuery = useAccountInfo(
    process.env.NEXT_PUBLIC_NODE_ADDRESS!
  );
  const accountHistoryQuery = useAccountHistory(address);
  const pendingQuery = usePending(address);
  const quorumQuery = useConfirmationQuorum();
  const aliases = useAliases();

  const pending = Object.entries(pendingQuery.data?.blocks ?? {});
  const alias = aliases.data?.find(
    (record) => record.account === address
  )?.alias;

  function getWeightPercent(account?: string, weight?: string) {
    const repWeight = parseFloat(
      safeRawToMega(
        (account &&
          (account === process.env.NEXT_PUBLIC_NODE_ADDRESS
            ? nodeAccountInfoQuery.data?.weight
            : quorumQuery.data?.peers.find((peer) => peer.account === account)
                ?.weight)) ||
          weight
      )
    );
    return (
      (repWeight /
        (parseFloat(safeRawToMega(quorumQuery.data?.online_stake_total)) ||
          1)) *
      100
    );
  }

  const weightPercent = getWeightPercent(
    address,
    accountInfoQuery.data?.weight
  );
  const isPR = weightPercent >= 0.01;
  const isRep =
    !isPR && parseFloat(safeRawToMega(accountInfoQuery.data?.weight)) > 1000;

  const isAddressValid = isNanoAddress(address, ["nano", "xrb"]);

  useEffect(() => {
    document.title = `Nanocafe - ${address}`;
  }, [address]);

  const copyToClipBoardHandler = () => {
    navigator.clipboard.writeText(address).then(() => {
      notify();
      console.log("Address is copied");
    });
  };

  if (typeof address !== 'string' || !isNanoAddress(address, ['nano', 'xrb'])) {
    return (
      <Indicator>
        <main>
          <h2>Invalid Address</h2>
        </main>
      </Indicator>
    );
  }

  return (
    <Indicator>
      <main className={account}>
        <h2
          style={{ cursor: "pointer", fontSize: "1.1rem" }}
          onClick={copyToClipBoardHandler}
        >
          <h2>{address}</h2>
          <h3 style={{ display: "flex" }}>
            {(alias || isPR) && (
              <sub>
                {isPR && <strong>Principal Representative</strong>}
                {isRep && <strong>Representative</strong>}
                {alias}
              </sub>
            )}
            <FaCopy style={{ marginLeft: "1rem", marginTop: ".3rem" }} />
          </h3>
        </h2>
        {accountHistoryQuery.isError ? (
          <>
            <h3></h3>
            <Card as="section">
              {isAddressValid ? (
                <>
                  <h4>
                    There are three reasons why you could have landed on this
                    screen:
                  </h4>
                  <p>
                    (1) The account you&apos;re searching has recently been created
                    and you have yet to receive a transaction into your account.
                  </p>
                  <p>
                    (2) The transaction you&apos;re searching has yet to be fully
                    received.
                  </p>
                  <p>(3) This account is invalid and does not exist.</p>
                  <p>
                    You can also try searching the block hash of the transaction
                    if the account address isn&apos;t working.
                  </p>
                  <p>
                    IMPORTANT: When a transaction is pending &apos;ready to receive&apos;,
                    the transaction is inside your account, it is not lost or in
                    any other account, simply open your wallet to confirm the
                    pending &apos;ready to receive&apos;.
                  </p>
                </>
              ) : (
                "This address is invalid!"
              )}
            </Card>
          </>
        ) : (
          <>
            <h3>Transactions:</h3>
            <section>
              <Properties as="section">
                <PropertiesItem label="Balance:" big>
                  <RawToMega amount={accountInfoQuery.data?.balance} />{" "}
                  <sub>NANO</sub>
                  <sub>
                    {" "}
                    (<RawToUSD raw={accountInfoQuery.data?.balance} />)
                  </sub>
                </PropertiesItem>

                {accountInfoQuery.data?.pending !== "0" && (
                  <PropertiesItem label="Pending:" big>
                    <RawToMega amount={accountInfoQuery.data?.pending} />{" "}
                    <sub>NANO</sub>
                    <sub>
                      {" "}
                      (<RawToUSD raw={accountInfoQuery.data?.pending} />)
                    </sub>
                  </PropertiesItem>
                )}

                {accountInfoQuery.data?.weight !== "0" && (
                  <PropertiesItem label="Voting weight:" big>
                    <RawToMega amount={accountInfoQuery.data?.weight} />{" "}
                    <sub>
                      (
                      {getWeightPercent(
                        undefined,
                        accountInfoQuery.data?.weight
                      ).toFixed(4)}
                      %)
                    </sub>
                  </PropertiesItem>
                )}

                {accountInfoQuery.data?.modified_timestamp && (
                  <PropertiesItem label="Last transaction:">
                    {dayjs(accountInfoQuery.data.modified_timestamp).format(
                      "LLL"
                    )}
                  </PropertiesItem>
                )}

                <PropertiesItem label="Representative:">
                  <span>
                    <Link href={`/${accountInfoQuery.data?.representative}`}>
                      {accountInfoQuery.data?.representative}
                    </Link>
                    <br />
                    <sub>
                      {accountInfoQuery.data?.representative ===
                        process.env.NEXT_PUBLIC_NODE_ADDRESS ||
                      !!quorumQuery.data?.peers.find(
                        (rep) =>
                          rep.account === accountInfoQuery.data?.representative
                      )
                        ? `${getWeightPercent(
                            accountInfoQuery.data?.representative,
                            accountInfoQuery.data?.weight
                          ).toFixed(4)}% of online voting weight.`
                        : "Representative offline!"}
                    </sub>
                  </span>
                </PropertiesItem>
              </Properties>

              {mnnAccountQuery.data && !mnnAccountQuery.isError && (
                <Properties as="section">
                  <h3 style={{ order: 0 }}>My Nano Ninja details:</h3>

                  {mnnAccountQuery.data.description && (
                    <PropertiesItem label="Description:">
                      {mnnAccountQuery.data.description}
                    </PropertiesItem>
                  )}
                  {mnnAccountQuery.data.website && (
                    <PropertiesItem label="Website:">
                      <a
                        href={mnnAccountQuery.data.website}
                        target="_blank"
                        rel="noopener nofollow noreferrer"
                      >
                        {mnnAccountQuery.data.website}
                      </a>
                    </PropertiesItem>
                  )}
                  {mnnAccountQuery.data.uptime && (
                    <PropertiesItem label="Uptime:">
                      {mnnAccountQuery.data.uptime.toFixed(3)}%
                    </PropertiesItem>
                  )}
                  {mnnAccountQuery.data.monitor && (
                    <>
                      <PropertiesItem label="Node version:">
                        {mnnAccountQuery.data.monitor.version}
                      </PropertiesItem>
                      <PropertiesItem label="Sync status:">
                        <span
                          className={
                            mnnAccountQuery.data.monitor.sync < 90
                              ? "red"
                              : undefined
                          }
                        >
                          {mnnAccountQuery.data.monitor.sync.toFixed(3)}%
                        </span>
                      </PropertiesItem>
                    </>
                  )}
                  <a
                    href={`https://mynano.ninja/account/${address}`}
                    target="_blank"
                    rel="noopener nofollow noreferrer"
                  >
                    full details
                  </a>
                </Properties>
              )}

              {pending.length > 0 && (
                <>
                  <h3>Ready to receive transactions:</h3>

                  <ul>
                    {pending.map(([hash, block]) => (
                      <li key={hash} className="pending">
                        <span>pending</span>
                        <strong>
                          {block.amount !== "0" && (
                            <>
                              {safeRawToMega(block.amount)} <sub>NANO</sub>
                            </>
                          )}
                        </strong>
                        <Link href={`/${hash}`} className="hash">
                          {hash}
                        </Link>
                        <Link href={`/${block.source}`}>{block.source}</Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </section>
            <ul>
              {accountHistoryQuery.data?.history?.map((block) => (
                <li key={block.hash} className={block.subtype}>
                  <span>{block.subtype ?? block.type}</span>
                  <span className="date show-on-mobile">
                    {block.local_timestamp.getTime() !== 0
                      ? dayjs(block.local_timestamp).format("LLL")
                      : "Unknown"}
                  </span>
                  <strong>
                    {(block.subtype === "send" ||
                      block.subtype === "receive") && (
                      <>
                        {block.subtype === "send" ? "-" : "+"}
                        {safeRawToMega(block.amount)} <sub>NANO</sub>
                      </>
                    )}
                  </strong>
                  <span className="date hide-on-mobile">
                    {block.local_timestamp.getTime() !== 0
                      ? dayjs(block.local_timestamp).format("LLL")
                      : "Unknown"}
                  </span>
                  <Link href={`/${block.hash}`} className="hash">
                    {block.hash}
                  </Link>
                  <Link href={`/${block.account}`}>{block.account}</Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </main>
    </Indicator>
  );
}
