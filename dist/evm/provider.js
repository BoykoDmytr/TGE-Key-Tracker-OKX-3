// src/evm/provider.ts
import { createPublicClient, http } from 'viem';
import { bsc, bscTestnet, base, arbitrum, mainnet, avalanche, optimism } from 'viem/chains';
const RPC = {
    bsc: process.env.RPC_BSC || '',
    bsc_testnet: process.env.RPC_BSC_TESTNET || '',
    base: process.env.RPC_BASE || '',
    arbitrum: process.env.RPC_ARBITRUM || '',
    ethereum: process.env.RPC_ETHEREUM || '', // нове
    avalanche: process.env.RPC_AVALANCHE || '', // нове
    optimism: process.env.RPC_OPTIMISM || '', // нове
};
const CHAIN = {
    bsc,
    bsc_testnet: bscTestnet,
    base,
    arbitrum,
    ethereum: mainnet, // нове
    avalanche, // нове
    optimism, // нове
};
const clients = new Map();
export function getPublicClient(chainKey) {
    const existing = clients.get(chainKey);
    if (existing)
        return existing;
    const url = RPC[chainKey];
    if (!url)
        throw new Error(`Missing RPC for chain ${chainKey}`);
    // Створюємо viem client, але віддаємо як “EvmClient”
    const client = createPublicClient({
        chain: CHAIN[chainKey],
        transport: http(url),
    });
    clients.set(chainKey, client);
    return client;
}
export function getExplorerTxUrl(chainKey, txHash) {
    const fallback = {
        bsc: 'https://bscscan.com/tx/',
        bsc_testnet: 'https://testnet.bscscan.com/tx/',
        base: 'https://basescan.org/tx/',
        arbitrum: 'https://arbiscan.io/tx/',
        ethereum: 'https://etherscan.io/tx/', // нове: Etherscan
        avalanche: 'https://snowtrace.io/tx/', // нове: SnowTrace (Avalanche C‑Chain)
        optimism: 'https://optimistic.etherscan.io/tx/', // нове: Optimistic Etherscan
    };
    return `${fallback[chainKey]}${txHash}`;
}
