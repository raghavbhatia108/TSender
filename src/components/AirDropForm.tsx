"use client"

import InputField from "./ui/InputField"
import { useEffect, useMemo, useState } from "react";
import { chainsToTSender, erc20Abi, tsenderAbi } from "@/constants"
import { useChainId, useConfig, useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract} from "wagmi"
import { readContract, waitForTransactionReceipt } from "@wagmi/core"
import { calculateTotal } from "@/utils";
import { formatUnits } from "viem";
import { CgSpinner } from "react-icons/cg";

const AirDropForm = () => {
    const [isMounted, setIsMounted] = useState(false);
    const [tokenAddress, setTokenAddress] = useState("");
    const [recipients, setRecipients] = useState("");
    const [amounts, setAmounts] = useState("");
    const chainId = useChainId();
    const config = useConfig();
    const account = useAccount();
    const total: number = useMemo(() => calculateTotal(amounts), [amounts]);
    const { data: hash, isPending, writeContractAsync } = useWriteContract();
    const {isLoading: isConfirming, isSuccess: isConfirmed, isError} = useWaitForTransactionReceipt({
        confirmations:1,
        hash
    })
    const [txState, setTxState] = useState("idle");
    const showSpinner = Boolean(isPending || txState.includes('Mining') || txState.includes("Submitted"));
    const { data: tokenName } = useReadContract({
  address: tokenAddress as `0x${string}`,
  abi: erc20Abi,
  functionName: "name",
}) as {data : string | undefined}

const {data: decimals} = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: "decimals",
}) as {data : number | undefined}

const totalTokens = decimals? formatUnits(BigInt(total), decimals) : 0;


    function getButtonContent(){
        if(isPending){
            return (
                    <div className="flex items-center justify-center gap-2 w-full">
                    <CgSpinner className="animate-spin" size={20} />
                    <span>Confirming in wallet...</span>
                </div>
            )
        }
        if(isConfirming){
             return (
                <div className="flex items-center justify-center gap-2 w-full">
                    <CgSpinner className="animate-spin" size={20} />
                    <span>Waiting for transaction to be included...</span>
                </div>
             )
        }
         if (isError) {
        
            return (
                <div className="flex items-center justify-center gap-2 w-full">
                    <span>Error, see console.</span>
                </div>
            )
        }
        if (isConfirmed) {
            return "Transaction confirmed."
        }
    }

    useEffect(()=>{
        setIsMounted(true);
        const savedTokenAddress = localStorage.getItem("tokenAddress");
        const savedRecipientsAddress = localStorage.getItem("recipientAddresses");
        const savedAmounts = localStorage.getItem("amounts");

        if(savedTokenAddress) setTokenAddress(savedTokenAddress);
        if(savedRecipientsAddress) setRecipients(savedRecipientsAddress);
        if(savedAmounts) setAmounts(savedAmounts);
    }, [])

    useEffect(()=>{
        localStorage.setItem('tokenAddress', tokenAddress)
    }, [tokenAddress])
    useEffect(()=>{
        localStorage.setItem('recipientAddresses', recipients)
    }, [recipients])
    useEffect(()=>{
        localStorage.setItem('amounts', amounts)
    }, [amounts])

    async function getApprovedAmount(TSenderAddress: string | null): Promise<number> {
        if (!TSenderAddress) {
            alert("No address found, Please use a supported chain")
            return 0;
        }
        const response = await readContract(config, {
            abi: erc20Abi,
            address: tokenAddress as `0x${string}`,
            functionName: "allowance",
            args: [account.address, TSenderAddress as `0x${string}`]
        })
        return response as number;
    }

    async function handleSubmit() {
        try {
            const TSenderAddress = chainsToTSender[chainId]["tsender"];
            const approvedAmount = await getApprovedAmount(TSenderAddress);
            if (approvedAmount < total) {
                setTxState("Awaiting Wallet Approval")
                const approvalHash = await writeContractAsync({
                    abi: erc20Abi,
                    address: tokenAddress as `0x${string}`,
                    functionName: "approve",
                    args: [TSenderAddress as `0x${string}`, BigInt(total)]
                })
                setTxState("Approval Submitted")
                setTxState("Approval Mining")

                const approvalReceipt = await waitForTransactionReceipt(config, {
                    hash: approvalHash
                })
                setTxState("Awaiting Wallet Airdrop");
                console.log("approval confirmed", approvalReceipt);
                await writeContractAsync({
                    abi: tsenderAbi,
                    address: TSenderAddress as `0x${string}`,
                    functionName: "airdropERC20",
                    args: [tokenAddress,
                        recipients.split(/[,\n]+/).map(addr => addr.trim()).filter(addr => addr !== ""),
                        amounts.split(/[,\n]+/).map(amt => amt.trim()).filter(amt => amt !== ""),
                        BigInt(total)
                    ]
                })
                setTxState("Airdrop Submitted");

                setTxState("Done");
            }
            else {
                setTxState("Awaiting Wallet Airdrop");
                await writeContractAsync({
                    abi: tsenderAbi,
                    address: TSenderAddress as `0x${string}`,
                    functionName: "airdropERC20",
                    args: [tokenAddress,
                        recipients.split(/[,\n]+/).map(addr => addr.trim()).filter(addr => addr !== ""),
                        amounts.split(/[,\n]+/).map(amt => amt.trim()).filter(amt => amt !== ""),
                        BigInt(total)
                    ]
                })
                setTxState("Airdrop Submitted");

                setTxState("Done");
            }
        }
        catch (error) {
            setTxState("error")
        }
    }
    if (!isMounted) return null;

    return (
        <div className="w-[60%] flex justify-center flex-col  mx-auto my-6 bg-white p-10 px-4 rounded-lg border border-2 border-blue-500  ring-4 ring-blue-500/20 gap-6">
           <h1 className="text-2xl font-bold text-center">TSender</h1>
            <InputField
                label="Token Address"
                placeholder="0x..."
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value)}
            />

            <InputField
                label="Recipients"
                placeholder="0x7489328...  0x7382749..."
                value={recipients}
                large={true}
                onChange={(e) => setRecipients(e.target.value)}
            />

            <InputField
                label="Amounts"
                placeholder="100,200,300,..."
                value={amounts}
                large={true}
                onChange={(e) => setAmounts(e.target.value)}
            />

            <div className="block text-sm border border-gray-300 rounded-md p-4 flex flex-col gap-2">
                <h1 className="font-bold">Transaction Details</h1>
                <p className="flex justify-between"><span className="font-extraLight">Token Name:</span> <span>{tokenName}</span></p>
                <p className="flex justify-between"><span className="font-extraLight">Total Amount (Wei):</span> <span>{total}</span></p>
                <p className="flex justify-between"><span className="font-extraLight">Total Amount (Tokens):</span> <span>{totalTokens}</span></p>
            </div>
            <button onClick={handleSubmit} className="px-6 py-2 rounded-md bg-blue-600 text-white font-semibold 
             hover:bg-blue-700 active:bg-blue-800 
             transition-colors duration-200 
             shadow-sm hover:shadow-md" disabled={showSpinner}>
                {
                    isPending || isError || isConfirming ? getButtonContent() : "Send Tokens"
                }
            </button>
        </div>
    )
}

export default AirDropForm
