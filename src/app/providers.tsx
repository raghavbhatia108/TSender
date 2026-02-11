"use client";

import { config } from "@/rainbowKitConfig";
import {WagmiProvider} from "wagmi";
import { type ReactNode } from "react";
import {ConnectButton, RainbowKitProvider} from "@rainbow-me/rainbowkit";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {useState} from "react";
import "@rainbow-me/rainbowkit/styles.css";

export function Providers({children}:{children:ReactNode}){
    const [queryClient] = useState(() => new QueryClient());
return(
    <WagmiProvider config = {config}>
        <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
            {children}
        </RainbowKitProvider>
    </QueryClientProvider>
    </WagmiProvider>
)
}