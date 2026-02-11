"use client"


import { ConnectButton } from '@rainbow-me/rainbowkit'
import {FaGithub} from "react-icons/fa"

const Header = () => {
  return (
    <header className='flex items-center justify-between p-8 py-5 bg-white'>
        <div className='flex items-center gap-7'>
          
       <img src="/LOGO.png" alt="Logo" className="h-15" />
         <a href="https://github.com/raghav-123/ts-tsender" target="_blank" rel="noopener noreferrer" className='text-gray-400 hover:text-gray-600 transition-colors'>
                <FaGithub size={40} />
            </a>
        </div>
         <p className='text-gray-400 font-extraLight'><i>Fast, gas-optimized token airdrops made simple ⚡</i></p>
<ConnectButton/>
    </header>
  )
}

export default Header
