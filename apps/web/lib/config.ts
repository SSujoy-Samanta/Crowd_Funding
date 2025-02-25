import { cookieStorage, createConfig, createStorage, http, injected } from 'wagmi';
import { anvil } from 'wagmi/chains';

export const config = createConfig({
    connectors:[injected()],
    chains: [anvil],
    ssr:true,
    storage: createStorage({
        storage: cookieStorage,
    }),
    transports: {
        [anvil.id]: http(process.env.RPC_URL||"http://127.0.0.1:8545"),
    },
});