"use client";

import {getDefaultConfig} from "@rainbow-me/rainbowkit";
import {anvil, zksync, mainnet} from "wagmi/chains";

export const config = getDefaultConfig({
appName: "TSender",
projectId:process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
chains: [anvil, zksync],
ssr:false
})

