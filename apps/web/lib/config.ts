import { createConfig, http, injected } from 'wagmi';
import { anvil } from 'wagmi/chains';

export const config = createConfig({
    connectors:[injected()],
    chains: [anvil],
    transports: {
        [anvil.id]: http('http://127.0.0.1:8545'),
    },
});