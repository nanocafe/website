import styled from "@emotion/styled";
import dayjs from "dayjs";
import React, { useMemo } from "react";
import { CellProps, Column, useSortBy, useTable } from "react-table";
import * as math from "mathjs";

import {
  ConfirmationQuorumPeer,
  Telemetry,
  useActiveDifficulty,
  useConfirmationHistory,
  useConfirmationQuorum,
  useTelemetry,
  useTPS,
} from "../api";
import { Account } from "../components/Account";
import { Card } from "../components/Card";
import { Indicator } from "../components/Indicator";
import { IntlNumber } from "../components/IntlNumber";
import { Properties, PropertiesItem } from "../components/Properties";
import { safeRawToMega } from "../utils";

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

const NumberCell: React.FC<CellProps<Telemetry, number>> = ({ value }) => {
  return (
    <span className="right">
      <IntlNumber number={value} />
    </span>
  );
};

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

const EMPTY_DATA: Telemetry[] = [];

export default function NetworkScreen() {
  const telemetryQuery = useTelemetry();
  const tpsQuery = useTPS();
  const quorumQuery = useConfirmationQuorum();
  const activeDifficultyQuery = useActiveDifficulty();
  const confirmationHistoryQuery = useConfirmationHistory();

  function getQuorumNode(node: Telemetry): ConfirmationQuorumPeer | undefined {
    return quorumQuery.data?.peers.find(
      (peer) => peer.ip === `[${node.address}]:${node.port}`
    );
  }

  const columns = useMemo<Column<Telemetry>[]>(
    () => [
      {
        Header: "Node",
        id: "node",
        accessor(row) {
          const fromQuorum = getQuorumNode(row);
          return fromQuorum ? (
            <Account account={fromQuorum.account} />
          ) : (
            row.node_id
          );
        },
      },
      {
        Header: "PR Node",
        id: "pr",
        className: "right",
        accessor(row) {
          const fromQuorum = getQuorumNode(row);
          const isPR =
            (parseFloat(safeRawToMega(fromQuorum?.weight)) /
              (parseFloat(
                safeRawToMega(quorumQuery.data?.online_stake_total)
              ) || 1)) *
              100 >
            0.01;
          return isPR ? "Yes" : "No";
        },
      },
      {
        Header: "Blocks",
        accessor: "block_count",
        Cell: NumberCell,
        sortType: "basic",
        className: "right",
        sortable: true,
        right: true,
      },
      {
        Header: "Cemented blocks",
        accessor: "cemented_count",
        Cell: NumberCell,
        sortType: "basic",
        className: "right",
        sortable: true,
        right: true,
      },
      {
        Header: "Unchecked blocks",
        accessor: "unchecked_count",
        Cell: NumberCell,
        sortType: "basic",
        className: "right",
        sortable: true,
        right: true,
      },
      {
        Header: "Uptime",
        accessor: "uptime",
        sortType: "basic",
        className: "right",
        Cell({ value }) {
          return dayjs.duration(value, "seconds").humanize();
        },
        sortable: true,
        right: true,
      },
      {
        Header: "Version",
        id: "version",
        sortable: true,
        className: "right",
        accessor(row) {
          return `${row.major_version}.${row.minor_version}.${
            row.patch_version
          }${
            row.pre_release_version !== "0"
              ? `-rc${row.pre_release_version}`
              : ""
          }`;
        },
        right: true,
      },
    ],
    [quorumQuery.data]
  );

  const unchecked = useMemo(() => {
    if (!telemetryQuery.data) {
      return 0;
    }

    return math
      .chain(
        telemetryQuery.data.metrics.map((metric) => metric.unchecked_count)
      )
      .median()
      .floor()
      .done();
  }, [telemetryQuery.data]);
  const blocks = useMemo(() => {
    if (!telemetryQuery.data) {
      return 0;
    }

    return math.max(
      telemetryQuery.data.metrics.map((metric) => metric.block_count)
    );
  }, [telemetryQuery.data]);
  const medianConfirmationTime = useMemo(() => {
    if (!confirmationHistoryQuery.data) {
      return 0;
    }

    return math
      .chain(
        confirmationHistoryQuery.data.confirmations.map(
          (confirmation) => confirmation.duration
        )
      )
      .median()
      .divide(1000)
      .done();
  }, [confirmationHistoryQuery.data]);

  const tpsData = tpsQuery.data
    ? Object.entries(tpsQuery.data)
        .filter(([node]) => {
          const telemetry = telemetryQuery.data?.metrics.find(
            (telemetry) => telemetry.node_id === node
          );
          const quorumNode = telemetry ? getQuorumNode(telemetry) : undefined;
          const isPR =
            (parseFloat(safeRawToMega(quorumNode?.weight)) /
              (parseFloat(
                safeRawToMega(quorumQuery.data?.online_stake_total)
              ) || 1)) *
              100 >
            0.01;
          return isPR;
        })
        .map(([_, tps]) => tps)
    : [];

  // console.log(tpsData);

  const { getTableProps, getTableBodyProps, headers, rows, prepareRow } =
    useTable(
      {
        columns,
        data: telemetryQuery.data?.metrics ?? EMPTY_DATA,
        initialState: {
          sortBy: [{ id: "node" }],
        } as any,
      },
      useSortBy
    );

  return (
    <Indicator
      show={
        telemetryQuery.isLoading ||
        quorumQuery.isLoading ||
        activeDifficultyQuery.isLoading ||
        confirmationHistoryQuery.isLoading
      }
    >
      <Container>
        <h2>Nano network stats:</h2>
        <SplitProperties>
          <Card>
            <PropertiesItem label="Average PR TPS:" big>
              {/* {tps ? tps.toFixed(2) : '...'} */}
              {tpsData && tpsData.length > 0
                ? math.mean(tpsData).toFixed(2)
                : "..."}
            </PropertiesItem>
          </Card>
          <Card>
            <PropertiesItem label="Median confirmation time:" big>
              {medianConfirmationTime.toFixed(3)} seconds
            </PropertiesItem>
          </Card>
          <Card>
            <PropertiesItem label="Blocks:" big>
              <IntlNumber number={blocks} />
            </PropertiesItem>
          </Card>
          <Card>
            <PropertiesItem label="Median unchecked blocks:" big>
              <IntlNumber number={unchecked} />
            </PropertiesItem>
          </Card>
          <Card>
            <PropertiesItem label="Difficulty multiplier:" big>
              x{activeDifficultyQuery.data?.multiplier.toFixed(2)}
            </PropertiesItem>
          </Card>
        </SplitProperties>
        <h2>Connected peers ({telemetryQuery.data?.metrics.length}):</h2>
        <section>
          <table {...getTableProps()}>
            <thead>
              <tr>
                {headers.map((column, index) => (
                  <th
                    {...column.getHeaderProps([
                      { className: (column as any).className },
                      (column as any).getSortByToggleProps(),
                    ])}
                    key={index}
                  >
                    {column.render("Header")}
                    <span>
                      {(column as any).isSorted
                        ? (column as any).isSortedDesc
                          ? " ↓"
                          : " ↑"
                        : ""}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row, i) => {
                prepareRow(row);
                return (
                  <Card as="tr" {...row.getRowProps()} key={i}>
                    {row.cells.map((cell, index) => (
                      <td
                        {...cell.getCellProps([
                          { className: (cell.column as any).className },
                        ])}
                        key={index}
                      >
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </Card>
                );
              })}
            </tbody>
          </table>
        </section>
      </Container>
    </Indicator>
  );
}
