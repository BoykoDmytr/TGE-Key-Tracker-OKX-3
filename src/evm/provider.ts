// src/evm/provider.ts
import { createPublicClient, http } from 'viem';
import { bsc, bscTestnet, base, arbitrum,
         mainnet, avalanche, optimism } from 'viem/chains';

export type ChainKey =
  | 'bsc'
  | 'bsc_testnet'
  | 'base'
  | 'arbitrum'
  | 'ethereum'     // новий: Ethereum mainnet
  | 'avalanche'    // новий: Avalanche C‑Chain
  | 'optimism';    // новий: Optimism

// Мінімум методів, які нам треба (без “важких” типів viem)
export type EvmClient = {
  getTransaction: (args: { hash: `0x${string}` }) => Promise<{ to: `0x${string}` | null }>;
  getTransactionReceipt: (args: { hash: `0x${string}` }) => Promise<{ logs: any[] }>;
  readContract: (args: any) => Promise<any>;
};

const RPC: Record<ChainKey, string> = {
  bsc: process.env.RPC_BSC || '',
  bsc_testnet: process.env.RPC_BSC_TESTNET || '',
  base: process.env.RPC_BASE || '',
  arbitrum: process.env.RPC_ARBITRUM || '',
  ethereum: process.env.RPC_ETHEREUM || '',   // нове
  avalanche: process.env.RPC_AVALANCHE || '', // нове
  optimism: process.env.RPC_OPTIMISM || '',   // нове
};

const CHAIN = {
  bsc,
  bsc_testnet: bscTestnet,
  base,
  arbitrum,
  ethereum: mainnet,  // нове
  avalanche,          // нове
  optimism,           // нове
} as const;

const clients = new Map<ChainKey, EvmClient>();

export function getPublicClient(chainKey: ChainKey): EvmClient {
  const existing = clients.get(chainKey);
  if (existing) return existing;

  const url = RPC[chainKey];
  if (!url) throw new Error(`Missing RPC for chain ${chainKey}`);

  // Створюємо viem client, але віддаємо як “EvmClient”
  const client = createPublicClient({
    chain: CHAIN[chainKey],
    transport: http(url),
  }) as unknown as EvmClient;

  clients.set(chainKey, client);
  return client;
}

export function getExplorerTxUrl(chainKey: ChainKey, txHash: string): string {
  const fallback: Record<ChainKey, string> = {
  bsc: 'https://bscscan.com/tx/',
  bsc_testnet: 'https://testnet.bscscan.com/tx/',
  base: 'https://basescan.org/tx/',
  arbitrum: 'https://arbiscan.io/tx/',
  ethereum: 'https://etherscan.io/tx/',        // нове: Etherscan
  avalanche: 'https://snowtrace.io/tx/',        // нове: SnowTrace (Avalanche C‑Chain)
  optimism: 'https://optimistic.etherscan.io/tx/', // нове: Optimistic Etherscan
};
  return `${fallback[chainKey]}${txHash}`;
}
