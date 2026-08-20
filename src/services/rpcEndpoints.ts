import type { RpcEndpointConfig } from '../types/blockchain';

export const DEFAULT_RPC_ENDPOINTS: RpcEndpointConfig[] = [
  {
    name: 'LlamaRPC Mainnet',
    httpUrl: 'https://eth.llamarpc.com',
  },
  {
    name: 'Public Node Gateway',
    httpUrl: 'https://ethereum-rpc.publicnode.com',
  },
  {
    name: 'Ankr Public RPC',
    httpUrl: 'https://rpc.ankr.com/eth',
  },
  {
    name: '1RPC Public',
    httpUrl: 'https://1rpc.io/eth',
  },
  {
    name: 'Cloudflare Ethereum',
    httpUrl: 'https://cloudflare-eth.com',
  },
];

const CUSTOM_RPC_KEY = 'eth_observatory_custom_rpc';

export function getCustomRpc(): RpcEndpointConfig | null {
  try {
    const saved = localStorage.getItem(CUSTOM_RPC_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error reading custom RPC:', e);
  }
  return null;
}

export function saveCustomRpc(config: RpcEndpointConfig | null) {
  try {
    if (config) {
      localStorage.setItem(CUSTOM_RPC_KEY, JSON.stringify(config));
    } else {
      localStorage.removeItem(CUSTOM_RPC_KEY);
    }
  } catch (e) {
    console.error('Error saving custom RPC:', e);
  }
}

export function getInitialEndpoints(): RpcEndpointConfig[] {
  const envRpc = import.meta.env.VITE_ETHEREUM_RPC_URL;
  const envWs = import.meta.env.VITE_ETHEREUM_WS_URL;

  const endpoints = [...DEFAULT_RPC_ENDPOINTS];

  if (envRpc) {
    endpoints.unshift({
      name: 'Environment RPC',
      httpUrl: envRpc,
      wsUrl: envWs,
      isCustom: true,
    });
  }

  const custom = getCustomRpc();
  if (custom && !endpoints.some((e) => e.httpUrl === custom.httpUrl)) {
    endpoints.unshift(custom);
  }

  return endpoints;
}
