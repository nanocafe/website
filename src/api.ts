import { useMutation, useQuery, UseQueryOptions } from "react-query";
import Parser from "rss-parser";

const parser = new Parser();

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";



type Interval =
  | "1m"
  | "3m"
  | "5m"
  | "15m"
  | "30m"
  | "1h"
  | "2h"
  | "4h"
  | "6h"
  | "8h"
  | "12h"
  | "1d"
  | "3d"
  | "1w"
  | "1M";

const INTERVAL_REFRESH: Record<Interval, number | false> = {
  "1m": 1000 * 60,
  "3m": 1000 * 60 * 3,
  "5m": 1000 * 60 * 5,
  "15m": 1000 * 60 * 15,
  "30m": 1000 * 60 * 30,
  "1h": 1000 * 60 * 60,
  "2h": 1000 * 60 * 60 * 2,
  "4h": 1000 * 60 * 60 * 4,
  "6h": 1000 * 60 * 60 * 6,
  "8h": 1000 * 60 * 60 * 8,
  "12h": 1000 * 60 * 60 * 12,
  "1d": false,
  "3d": false,
  "1w": false,
  "1M": false
};



export const useNanoTicker = (
  symbol: string
  // options?: UseQueryOptions<BinanceTicker, unknown, BinanceTicker, string[]>
) =>
  useQuery(
    ["nano", "ticker", symbol],
    async () => {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/nano?tickers=true&market_data=true`
      );
      const json = await res.json();
      return json;
    },
    {
      refetchInterval: 20000
      // ...options
    }
  );


async function _fetch<T>(action: string, payload?: any, convert?: (data: any) => T): Promise<T> {
  const body = JSON.stringify({
    action,
    ...payload
  });
  const res = await fetch(`${API_URL}/rpc`, {
    method: "POST",
    headers: {
      "X-Auth": "c49f14008b12f2104ed5f52f469921fabcc59b09a1a24a6b5b6facf5a8e90b69",
      "Content-Type": "application/json",
      "Content-Length": body.length.toString()
    },
    body
  });
  const obj = await res.json().then(convert ?? ((v) => v));
  return obj as T;
}

interface ConfirmationHistory {
  confirmation_stats: {
    count: string;
    average: string;
  };
  confirmations: Confirmation[];
}

interface Confirmation {
  hash: string;
  duration: string;
  time: string;
  tally: string;
  blocks: string;
  voters: string;
  request_count: string;
}

interface ConfirmationActive {
  confirmations: string[];
  unconfirmed: string;
  confirmed: string;
}

interface Block {
  account: string;
  balance: string;
  link: string;
  link_as_account: string;
  previous: string;
  representative: string;
  signature: string;
  type: string;
  work: string;
}

interface Unchecked {
  blocks: Record<string, Block>;
}

interface BlockInfo {
  amount: string;
  balance: string;
  block_account: string;
  confirmed: boolean;
  contents: Block;
  height: number;
  local_timestamp: Date;
  subtype: string;
  source_account?: string;
  pending: boolean;
}

interface AccountInfo {
  account_version: number;
  balance: string;
  block_count: number;
  confirmation_height: number;
  confirmation_height_frontier: string;
  frontier: string;
  modified_timestamp: Date;
  open_block: string;
  representative_block: string;
  representative: string;
  weight: string;
  pending: string;
}

interface HistoryBlock extends Omit<Block, "link_as_account"> {
  hash: string;
  height: number;
  local_timestamp: Date;
  subtype: string;
  amount: string;
}

interface AccountHistory {
  account: string;
  history: HistoryBlock[];
  previous?: string;
}

export interface TelemetryStream {
  account_count: string;
  active_difficulty: string;
  address: string;
  bandwidth_cap: number;
  block_count: number;
  cemented_count: number;
  major_version: string;
  maker: number;
  minor_version: string;
  patch_version: string;
  peer_count: number;
  port: number;
  pre_release_version: string;
  protocol_version: string;
  timestamp: Date;
  unchecked_count: number;
  uptime: number;
}

interface PendingBlock {
  amount: string;
  source: string;
}

interface Pending {
  blocks: Record<string, PendingBlock>;
}

export interface ConfirmationQuorumPeer {
  account: string;
  ip: string;
  weight: string;
}

interface ConfirmationQuorum {
  online_stake_total: string;
  online_weight_minimum: string;
  online_weight_quorum_percent: number;
  peers: ConfirmationQuorumPeer[];
  peers_stake_required: string;
  peers_stake_total: string;
  quorum_delta: string;
}

interface Alias {
  account: string;
  alias: string;
}

export interface Telemetry {
  block_count: number;
  cemented_count: number;
  unchecked_count: number;
  account_count: number;
  bandwidth_cap: number;
  peer_count: number;
  protocol_version: number;
  uptime: number;
  genesis_block: string;
  major_version: string;
  minor_version: string;
  patch_version: string;
  pre_release_version: string;
  maker: number;
  timestamp: Date;
  active_difficulty: string;
  node_id: string;
  signature: string;
  address: string;
  port: string;
}

interface TelemetryRaw {
  metrics: Telemetry[];
}

interface ActiveDifficulty {
  multiplier: number;
  network_current: string;
  network_minimum: string;
  network_receive_current: string;
  network_receive_minimum: string;
}

interface Stat {
  time: string;
  type: string;
  detail: string;
  dir: "in" | "out";
  value: string;
}

interface Stats {
  type: string;
  created: Date;
  entries: Stat[];
  stat_duration_seconds: string;
}

export interface MNNMonitor {
  blocks: number;
  sync: number;
  url: string;
  version: string;
}

export interface MNNTelemetry {
  block_count: number;
  cemented_count: number;
  major_version: number;
  minor_version: number;
  patch_version: number;
  pre_release_version: number;
  peer_count: number;
  protocol_version: number;
}

export interface MNNUptimeOver {
  day: number;
  week: number;
  month: number;
  "3_months": number;
  "6_months": number;
  year: number;
}

export interface MNNNetwork {
  provider: string;
}

export interface MNNLocation {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface MNNAccount {
  monitor?: MNNMonitor;
  telemetry: MNNTelemetry;
  uptime_over: MNNUptimeOver;
  network: MNNNetwork;
  location: Location;
  votingweight: number;
  delegators: number;
  votelatency: number;
  verified: boolean;
  uptime: number;
  score: number;
  closing: boolean;
  avoid: boolean;
  account: string;
  lastVoted: Date;
  alias: string;
  description: string;
  website: string;
  created: Date;
  slug: string;
  votelatency_current: number;
}

interface FaucetResponse {
  block: string;
}

async function getConfirmationHistory() {
  return _fetch<ConfirmationHistory>("confirmation_history");
}

async function getConfirmationActive() {
  return _fetch<ConfirmationActive>("confirmation_active");
}

async function getUnchecked(count: number = 1) {
  return _fetch<Unchecked>("unchecked", { count });
}

export async function getBlockInfo(hash: string) {
  return _fetch<BlockInfo>(
    "blocks_info",
    { hashes: [hash], json_block: true, source: true, pending: true, balance: true },
    ({ blocks }: { blocks: Record<string, Record<string, any>> }) => ({
      amount: blocks[hash].amount,
      balance: blocks[hash].balance,
      block_account: blocks[hash].block_account,
      confirmed: blocks[hash].confirmed === "true",
      contents: blocks[hash].contents,
      height: parseInt(blocks[hash].height),
      local_timestamp: new Date(parseInt(blocks[hash].local_timestamp) * 1000),
      subtype: blocks[hash].subtype,
      source_account: blocks[hash].source_account,
      pending: blocks[hash].pending === "1"
    })
  );
}

export async function getAccountInfo(account: string) {
  return _fetch<AccountInfo>(
    "account_info",
    { account, representative: true, pending: true, weight: true },
    (o: Record<string, any>) => ({
      account_version: parseInt(o.account_version),
      balance: o.balance,
      block_count: parseInt(o.block_count),
      confirmation_height: parseInt(o.confirmation_height),
      confirmation_height_frontier: o.confirmation_height_frontier,
      frontier: o.frontier,
      modified_timestamp: new Date(parseInt(o.modified_timestamp) * 1000),
      open_block: o.open_block,
      representative_block: o.representative_block,
      representative: o.representative,
      pending: o.pending,
      weight: o.weight
    })
  );
}

async function getAccountHistory(account: string) {
  return _fetch<AccountHistory>(
    "account_history",
    { account, raw: true, count: 30 },
    (o: Record<string, any>) => ({
      account: o.account,
      history: o.history.map(
        (e: Record<string, any>): HistoryBlock => ({
          account: e.account,
          balance: e.balance,
          hash: e.hash,
          height: parseInt(e.height),
          link: e.link,
          local_timestamp: new Date(parseInt(e.local_timestamp) * 1000),
          previous: e.previous,
          representative: e.representative,
          signature: e.signature,
          subtype: e.subtype,
          type: e.type,
          work: e.work,
          amount: e.amount
        })
      ),
      previous: o.previous
    })
  );
}

async function getPending(account: string) {
  return _fetch<Pending>("pending", { account, count: 30, source: true });
}

async function getConfirmationQuorum() {
  return _fetch<ConfirmationQuorum>(
    "confirmation_quorum",
    { peer_details: true },
    (o: Record<string, any>) => ({
      online_stake_total: o.online_stake_total,
      online_weight_minimum: o.online_weight_minimum,
      online_weight_quorum_percent: parseFloat(o.online_weight_quorum_percent),
      peers: o.peers,
      peers_stake_required: o.peers_stake_required,
      peers_stake_total: o.peers_stake_total,
      quorum_delta: o.quorum_delta
    })
  );
}

async function getTelemetry() {
  return _fetch<TelemetryRaw>(
    "telemetry",
    { raw: true },
    (o: { metrics: Record<string, any>[] }) => ({
      metrics: o.metrics.map((metric) => ({
        block_count: parseInt(metric.block_count),
        cemented_count: parseInt(metric.cemented_count),
        unchecked_count: parseInt(metric.unchecked_count),
        account_count: parseInt(metric.account_count),
        bandwidth_cap: parseInt(metric.bandwidth_cap),
        peer_count: parseInt(metric.peer_count),
        protocol_version: parseInt(metric.protocol_version),
        uptime: parseInt(metric.uptime),
        genesis_block: metric.genesis_block,
        major_version: metric.major_version,
        minor_version: metric.minor_version,
        patch_version: metric.patch_version,
        pre_release_version: metric.pre_release_version,
        maker: parseInt(metric.maker),
        timestamp: new Date(parseInt(metric.timestamp) * 1000),
        active_difficulty: metric.active_difficulty,
        node_id: metric.node_id,
        signature: metric.signature,
        address: metric.address,
        port: metric.port
      }))
    })
  );
}

async function getNodeTelemetry() {
  return _fetch<Telemetry>(
    "telemetry",
    { address: "::1", port: 7075 },
    (metric: Record<string, any>) => ({
      block_count: parseInt(metric.block_count),
      cemented_count: parseInt(metric.cemented_count),
      unchecked_count: parseInt(metric.unchecked_count),
      account_count: parseInt(metric.account_count),
      bandwidth_cap: parseInt(metric.bandwidth_cap),
      peer_count: parseInt(metric.peer_count),
      protocol_version: parseInt(metric.protocol_version),
      uptime: parseInt(metric.uptime),
      genesis_block: metric.genesis_block,
      major_version: metric.major_version,
      minor_version: metric.minor_version,
      patch_version: metric.patch_version,
      pre_release_version: metric.pre_release_version,
      maker: parseInt(metric.maker),
      timestamp: new Date(parseInt(metric.timestamp) * 1000),
      active_difficulty: metric.active_difficulty,
      node_id: metric.node_id,
      signature: metric.signature,
      address: metric.address,
      port: metric.port
    })
  );
}

async function getActiveDifficulty() {
  return _fetch<ActiveDifficulty>("active_difficulty", {}, (o: Record<string, any>) => ({
    multiplier: parseFloat(o.multiplier),
    network_current: o.network_current,
    network_minimum: o.network_minimum,
    network_receive_current: o.network_receive_current,
    network_receive_minimum: o.network_receive_minimum
  }));
}

async function getTelemetryStream(): Promise<TelemetryStream[]> {
  const res = await fetch("/api/telemetry");
  const json = await res.json();
  return json as TelemetryStream[];
}

async function getAliases(): Promise<Alias[]> {
  const res = await fetch("https://mynano.ninja/api/accounts/aliases");
  const json = await res.json();
  return json as Alias[];
}

async function getMNNAccount(address: string): Promise<MNNAccount> {
  const res = await fetch(`https://mynano.ninja/api/accounts/${address}`);
  const json = await res.json();
  if (res.status === 404) {
    throw new Error("404");
  }
  return json as MNNAccount;
}

interface TPS {
  [k: string]: number;
}

async function getTPS(): Promise<TPS> {
  const res = await fetch(`${API_URL}/api/tps?all=true`);
  const json = await res.json();
  return json as TPS;
}

async function getRSS(kind: "nf" | "reddit" | "forum"): Promise<any> {
  const rss = await fetch(`${API_URL}/api/feed/${kind}`);
  return parser.parseString(await rss.text());
}

async function postFaucet(address: string): Promise<FaucetResponse> {
  const body = JSON.stringify({
    address
  });
  const res = await fetch(`${API_URL}/api/faucet`, {
    method: "POST",
    headers: {
      "X-Auth": "c49f14008b12f2104ed5f52f469921fabcc59b09a1a24a6b5b6facf5a8e90b69",
      "Content-Type": "application/json",
      "Content-Length": body.length.toString()
    },
    body
  });
  if (res.status >= 400) {
    throw new Error(res.statusText);
  }
  return {} as FaucetResponse;
}

export const useConfirmationHistory = () =>
  useQuery("confirmation_history", () => getConfirmationHistory());
export const useConfirmationActive = () =>
  useQuery("confirmation_active", () => getConfirmationActive());
export const useUnchecked = () => useQuery("unchecked", () => getUnchecked());

export const useAccountInfo = (account: string) =>
  useQuery(["account_info", account], () => getAccountInfo(account), {
    retry: false
  });
export const useAccountHistory = (account: string) =>
  useQuery(["account_history", account], () => getAccountHistory(account), {
    retry: false
  });
export const usePending = (account: string) =>
  useQuery(["pending", account], () => getPending(account));
export const useConfirmationQuorum = () =>
  useQuery(["confirmation_quorum"], () => getConfirmationQuorum());
export const useTelemetry = () =>
  useQuery(["telemetry"], () => getTelemetry(), {
    refetchInterval: 10000 * 60 * 1
  });
export const useNodeTelemetry = () =>
  useQuery(["node_telemetry"], () => getNodeTelemetry(), {
    refetchInterval: 10000 * 10
  });
export const useTPS = () =>
  useQuery(["tps"], () => getTPS(), {
    refetchInterval: 10000 * 5
  });
export const useActiveDifficulty = () =>
  useQuery(["active_difficulty"], () => getActiveDifficulty());
export const useTelemetryStream = () =>
  useQuery(["telemetry_stream"], () => getTelemetryStream(), {
    refetchInterval: 10000 * 20
  });
export const useAliases = () => useQuery(["aliases"], () => getAliases());
export const useMNNAccount = (address: string) =>
  useQuery(["mnn_account", address], () => getMNNAccount(address), {
    retry: false
  });
export const useRSS = (kind: "nf" | "reddit" | "forum") =>
  useQuery(["feed", kind], () => getRSS(kind));

export const useFaucetMutation = () => useMutation((address: string) => postFaucet(address));
