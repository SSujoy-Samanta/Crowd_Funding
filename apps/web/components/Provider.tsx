'use client';
import { config } from "@/lib/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { RecoilRoot } from "recoil";
import { type State, WagmiProvider } from "wagmi";


const queryClient = new QueryClient();
interface Props {
  children: React.ReactNode,
  initialState: State | undefined,
}

export const Provider = ({ children, initialState }: Props) => {
    return (
      <SessionProvider>
        <RecoilRoot>
          <WagmiProvider config={config} initialState={initialState}>
            <QueryClientProvider client={queryClient}>
              {children}
            </QueryClientProvider>
          </WagmiProvider>
        </RecoilRoot>
      </SessionProvider>
    );
};