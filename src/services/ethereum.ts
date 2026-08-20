import { createPublicClient, http, formatEther, formatGwei, type Address } from 'viem';
import { mainnet } from 'viem/chains';
import type { EthBlock, EthTransaction, RpcEndpointConfig } from '../types/blockchain';
import { getInitialEndpoints } from './rpcEndpoints';

export class EthereumService {
  private currentEndpointIndex = 0;
  private endpoints: RpcEndpointConfig[];
  private client: ReturnType<typeof createPublicClient>;
  private latencyMs: number = 0;

  constructor() {
    this.endpoints = getInitialEndpoints();
    this.client = this.createClient(this.endpoints[0].httpUrl);
  }

  private createClient(rpcUrl: string) {
    return createPublicClient({
      chain: mainnet,
      transport: http(rpcUrl, {
        retryCount: 2,
        retryDelay: 1000,
        timeout: 10000,
      }),
    });
  }

  public setEndpoint(endpoint: RpcEndpointConfig) {
    const existingIndex = this.endpoints.findIndex((e) => e.httpUrl === endpoint.httpUrl);
    if (existingIndex >= 0) {
      this.currentEndpointIndex = existingIndex;
    } else {
      this.endpoints.unshift(endpoint);
      this.currentEndpointIndex = 0;
    }
    this.client = this.createClient(endpoint.httpUrl);
  }

  public getCurrentEndpoint(): RpcEndpointConfig {
    return this.endpoints[this.currentEndpointIndex] || this.endpoints[0];
  }

  public getAllEndpoints(): RpcEndpointConfig[] {
    return this.endpoints;
  }

  public getLatency(): number {
    return this.latencyMs;
  }

  public async switchToNextEndpoint(): Promise<boolean> {
    if (this.endpoints.length <= 1) return false;
    this.currentEndpointIndex = (this.currentEndpointIndex + 1) % this.endpoints.length;
    const next = this.endpoints[this.currentEndpointIndex];
    console.warn(`[EthereumService] Switching to fallback RPC endpoint: ${next.name} (${next.httpUrl})`);
    this.client = this.createClient(next.httpUrl);
    return true;
  }

  public async getLatestBlockNumber(): Promise<bigint> {
    const start = performance.now();
    try {
      const blockNum = await this.client.getBlockNumber();
      this.latencyMs = Math.round(performance.now() - start);
      return blockNum;
    } catch (err) {
      console.error('[EthereumService] Failed to fetch block number on current RPC:', err);
      const switched = await this.switchToNextEndpoint();
      if (switched) {
        return await this.client.getBlockNumber();
      }
      throw err;
    }
  }

  public async getBlockWithTransactions(blockNumber?: bigint): Promise<{
    block: EthBlock;
    transactions: EthTransaction[];
  }> {
    try {
      const rawBlock = await this.client.getBlock({
        blockNumber,
        includeTransactions: true,
      });

      const timestampMs = Number(rawBlock.timestamp) * 1000;
      const timeDate = new Date(timestampMs);
      const timeFormatted = timeDate.toTimeString().split(' ')[0]; // "HH:MM:SS"

      const block: EthBlock = {
        number: Number(rawBlock.number),
        hash: rawBlock.hash || '',
        timestamp: timestampMs,
        transactionCount: rawBlock.transactions.length,
        gasUsed: rawBlock.gasUsed.toString(),
        gasLimit: rawBlock.gasLimit.toString(),
        baseFeePerGas: rawBlock.baseFeePerGas ? formatGwei(rawBlock.baseFeePerGas) : undefined,
      };

      const transactions: EthTransaction[] = [];

      for (const tx of rawBlock.transactions) {
        if (typeof tx === 'string') continue;

        const valueWei = tx.value || 0n;
        const valueEth = formatEther(valueWei);
        
        let gasPriceGwei = '0';
        let gasFeeEth = '0';
        const effectiveGasPrice = tx.gasPrice || rawBlock.baseFeePerGas || 0n;
        if (effectiveGasPrice > 0n) {
          gasPriceGwei = Number(formatGwei(effectiveGasPrice)).toFixed(2);
          const gasUnits = tx.gas || 21000n;
          const feeWei = gasUnits * effectiveGasPrice;
          gasFeeEth = Number(formatEther(feeWei)).toFixed(6);
        }

        let inputSnippet: string | undefined;
        if (tx.input && tx.input !== '0x') {
          inputSnippet = tx.input.length > 18 ? `${tx.input.slice(0, 10)}...${tx.input.slice(-8)}` : tx.input;
        }

        transactions.push({
          hash: tx.hash,
          from: tx.from.toLowerCase(),
          to: tx.to ? tx.to.toLowerCase() : null,
          value: Number(valueEth) > 0.0001 ? Number(valueEth).toFixed(4) : Number(valueEth) > 0 ? '<0.0001' : '0.0000',
          valueWei,
          gas: tx.gas ? Number(tx.gas).toLocaleString() : '21,000',
          gasPriceGwei,
          gasFeeEth,
          blockNumber: Number(rawBlock.number),
          timestamp: timestampMs,
          timeFormatted,
          isContractCreation: tx.to === null,
          status: 'SUCCESS',
          inputDataSnippet: inputSnippet,
          nonce: tx.nonce,
        });
      }

      return { block, transactions };
    } catch (err) {
      console.error('[EthereumService] Failed to fetch block with transactions:', err);
      const switched = await this.switchToNextEndpoint();
      if (switched) {
        return this.getBlockWithTransactions(blockNumber);
      }
      throw err;
    }
  }

  public async getWalletBalance(address: string): Promise<string> {
    try {
      const balanceWei = await this.client.getBalance({
        address: address as Address,
      });
      return Number(formatEther(balanceWei)).toFixed(4);
    } catch (err) {
      console.error(`[EthereumService] Failed to fetch balance for ${address}:`, err);
      return '0.0000';
    }
  }

  public async getWalletTxCount(address: string): Promise<number> {
    try {
      const count = await this.client.getTransactionCount({
        address: address as Address,
      });
      return count;
    } catch (err) {
      console.error(`[EthereumService] Failed to fetch tx count for ${address}:`, err);
      return 0;
    }
  }
}

export const ethereumService = new EthereumService();
