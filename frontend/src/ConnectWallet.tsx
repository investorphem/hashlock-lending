import { AppConfig, UserSession, showConnect } from '@stacks/connect'
import { Wallet } from 'lucide-react'

const appConfig = new AppConfig(['store_write', 'publish_data'])
const session = new UserSession({ appConfig })

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
        const userData = session.loadUserData()
        onConnect(userData.profile.stxAddress.mainnet)
      },
      userSession: session,
    })
  }

  return (
    <div className="flex flex-col items-center justify-center py-6 w-full">
      {/* Icon Container */}
      <div className={`mb-6 p-5 rounded-3xl transition-colors duration-500 ${
        theme === 'dark' 
          ? 'bg-[#00E5FF]/10 shadow-[0_0_30px_rgba(0,229,255,0.15)]' 
          : 'bg-blue-50 shadow-inner'
      }`}>
        <Wallet 
          size={52} 
          strokeWidth={1.5}
          className={theme === 'dark' ? 'text-[#00E5FF]' : 'text-blue-600'} 
        />
      </div>

      {/* Copy */}
      <h3 className={`text-3xl font-extrabold mb-3 tracking-tight ${
        theme === 'dark' ? 'text-white' : 'text-gray-900'
      }`}>
        Access Vault
      </h3>
      <p className={`mb-10 text-center px-4 max-w-sm leading-relaxed ${
        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
      }`}>
        Sign in securely with Leather or Xverse to unlock your Bitcoin yield.
      </p>

      {/* Premium Button */}
      <button
        onClick={handleConnect}
        className={`
          group relative w-full flex justify-center items-center gap-3 py-4 px-8 
          text-lg font-bold rounded-2xl transition-all duration-300 overflow-hidden
          ${theme === 'dark'
            ? 'bg-[#1A202C] text-[#00E5FF] border border-[#00E5FF]/30 hover:border-[#00E5FF] hover:shadow-[0_0_25px_rgba(0,229,255,0.4)] hover:bg-[#00E5FF]/10'
            : 'bg-white text-blue-600 border-2 border-blue-100 hover:border-blue-600 hover:shadow-xl hover:bg-blue-50'
          }
        `}
      >
        <span>Connect Wallet</span>
        <span className={`
          transition-transform duration-300 group-hover:translate-x-1.5
          ${theme === 'dark' ? 'text-[#00E5FF]' : 'text-blue-600'}
        `}>
          →
        </span>
      </button>
    </div>
  )
}
