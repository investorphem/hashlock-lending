import { showConnect } from '@stacks/connect'
import { Wallet, ArrowRight } from 'lucide-react'
import { userSession } from './lib/stacks' // Use the centralized session

interface ConnectWalletProps {
  onConnect: (addr: string) => void
  theme?: 'dark' | 'light'
}

export function ConnectWallet({ onConnect, theme = 'dark' }: ConnectWalletProps) {

  const handleConnect = () => {
    showConnect({
      appDetails: {
        name: 'HashLock Lending',
        icon: window.location.origin + '/favicon.svg'
      },
      onFinish: () => {
        const userData = userSession.loadUserData()
        // Ensure we grab the right address format
        onConnect(userData.profile.stxAddress.mainnet)
      },
      userSession,
    })
  }

  return (
    <div className="flex flex-col items-center justify-center py-6 w-full group/container">

      {/* Icon Container with Floating Animation */}
      <div className={`
        mb-8 p-6 rounded-[2.5rem] transition-all duration-700
        group-hover/container:scale-105 group-hover/container:-translate-y-2
        ${theme === 'dark' 
          ? 'bg-[#00E5FF]/5 border border-[#00E5FF]/20 shadow-[0_0_50px_rgba(0,229,255,0.1)]' 
          : 'bg-blue-50/50 border border-blue-100 shadow-xl'
        }
      `}>
        <Wallet 
          size={60} 
          strokeWidth={1.2}
          className={`transition-transform duration-500 group-hover/container:rotate-12 ${
            theme === 'dark' ? 'text-[#00E5FF] drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]' : 'text-blue-600'
          }`} 
        />
      </div>

      {/* Text Content */}
      <div className="text-center mb-10">
        <h3 className={`text-3xl font-extrabold mb-3 tracking-tight ${
          theme === 'dark' ? 'text-white' : 'text-slate-900'
        }`}>
          Unlock Your Vault
        </h3>
        <p className={`text-base leading-relaxed px-6 ${
          theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
        }`}>
          Connect your Stacks wallet to manage your trustless Bitcoin-backed positions.
        </p>
      </div>

      {/* Glassmorphism Premium Button */}
      <button
        onClick={handleConnect}
        className={`
          group relative w-full flex justify-center items-center gap-3 py-4.5 px-8 
          text-lg font-bold rounded-2xl transition-all duration-500 overflow-hidden
          backdrop-blur-md border
          ${theme === 'dark'
            ? 'bg-white/[0.03] text-[#00E5FF] border-white/10 hover:border-[#00E5FF]/50 hover:bg-[#00E5FF]/5 hover:shadow-[0_0_30px_rgba(0,229,255,0.2)]'
            : 'bg-blue-600 text-white border-transparent hover:bg-blue-700 hover:shadow-2xl shadow-blue-200'
          }
        `}
      >
        {/* Shine Overlay effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />

        <span className="relative z-10">Connect Wallet</span>

        <ArrowRight 
          size={20} 
          className={`relative z-10 transition-transform duration-300 group-hover:translate-x-1.5 ${
            theme === 'dark' ? 'text-[#00E5FF]' : 'text-white'
          }`} 
        />
      </button>

      {/* Security Badge */}
      <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        Secure SIP-010 Integration
      </p>
    </div>
  )
}