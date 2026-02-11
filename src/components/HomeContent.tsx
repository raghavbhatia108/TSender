"use client"

import AirDropForm from "./AirDropForm"
import { useConnection } from 'wagmi'
import { useState, useEffect } from 'react'

export const HomeContent = () => {
  const [isMounted, setIsMounted] = useState(false)
  const { isConnected } = useConnection()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <div>
      {isConnected ?

        <AirDropForm />
        : <div className="w-[60%] mx-auto my-10 
                bg-white 
                p-10 
                rounded-xl 
                border-2 border-blue-500 
                ring-4 ring-blue-500/20
                flex flex-col items-center justify-center
                text-center gap-4">

  <h1 className="text-2xl font-bold text-zinc-900">
    Connect Your Wallet
  </h1>

  <p className="text-zinc-600 text-sm max-w-md">
    Please connect your wallet to use the AirDrop app and send tokens to multiple recipients.
  </p>

</div>

      }
    </div>
  )
}

export default HomeContent
