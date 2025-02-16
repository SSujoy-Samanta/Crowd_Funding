'use client';
import { config } from "@/lib/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { RecoilRoot } from "recoil";
import { WagmiProvider } from "wagmi";


const queryClient = new QueryClient();

export const Provider = ({ children }: { children: React.ReactNode }) => {
    return (
      <SessionProvider>
        <RecoilRoot>
          <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
              {children}
            </QueryClientProvider>
          </WagmiProvider>
        </RecoilRoot>
      </SessionProvider>
    );
};