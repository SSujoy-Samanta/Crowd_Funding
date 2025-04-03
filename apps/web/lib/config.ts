import { cookieStorage, createConfig, createStorage, http, injected } from 'wagmi';
import { anvil,sepolia } from 'wagmi/chains';

// Check if RPC_URL is set in the environment
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL;

if (!RPC_URL) {
  alert("RPC_URL is not set in the environment. Using default URL: http://127.0.0.1:8545");
}

export const config = createConfig({
    connectors:[injected()],
    // chains: [anvil],
    chains: [sepolia],
    ssr:true,
    storage: createStorage({
        storage: cookieStorage,
    }),
    transports: {
        // [anvil.id]: http(process.env.RPC_URL||"http://127.0.0.1:8545"),
        [sepolia.id]: http(RPC_URL||"http://127.0.0.1:8545"),
    },
});