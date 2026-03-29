import { useState, useEffect } from 'react'
import { ConnectWallet } from './ConnectWallet'
import { SupplyWithdraw } from './SupplyWithdraw'
import { userSession } from './lib/stacks'
import { Toaster, toast } from 'sonner'
import { Moon, Sun } from 'lucide-react'

export default function App() {
  const [address, setAddress] = useState<string>('')
  
  // 1. Initialize state from localStorage or system preference
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('hashlock-theme');
    if (saved === 'dark' || saved === 'light') return saved;
    
    // Optional: Default to system preference if nothing is saved
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  })

  // 2. Persist theme choice and update the DOM
  useEffect(() => {
    const root = window.document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    localStorage.setItem('hashlock-theme', theme);
  }, [theme]);

  // Hydrate session on load
  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData()
      setAddress(userData.profile.stxAddress.mainnet)
    }
  }, [])

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  const handleSignOut = () => {
    userSession.signUserOut('/')
    setAddress('')
    toast('Wallet Disconnected', {
      className: theme === 'dark' ? 'bg-[#1A202C] text-white border-gray-700' : 'bg-white text-black',
    })
  }

  const handleConnect = (addr: string) => {
    setAddress(addr)
    toast.success('Wallet Connected', {
      icon: '🔒',
      style: { 
        background: theme === 'dark' ? '#0A1118' : '#fff', 
        color: '#4ADE80', 
        borderColor: '#4ADE80' 
      }
    })
  }

  return (
    // We use the 'dark' class here as well for Tailwind nested styling
    <div className={`min-h-screen transition-colors duration-500 ${theme} ${theme === 'dark' ? 'bg-[#0A1118] text-white' : 'bg-[#F8FAFC] text-[#0A1118]'}`}>

      <Toaster 
        position="top-right" 
        theme={theme}
        toastOptions={{
          className: 'border-l-4 border-[#00E5FF] shadow-2xl rounded-xl font-medium tracking-wide',
        }}
      />

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Navigation / Header */}
        <header className="flex justify-between items-center mb-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#00E5FF] to-blue-600 shadow-[0_0_20px_rgba(0,229,255,0.3)]">
              <span className="text-white font-bold text-xl">H</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">HashLock</h1>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-all duration-300 ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={20} className="text-[#00E5FF]" /> : <Moon size={20} />}
            </button>

            {userSession.isUserSignedIn() && (
              <button 
                onClick={handleSignOut}
                className={`text-sm font-semibold px-4 py-2 rounded-lg border transition-all duration-300 ${
                  theme === 'dark' 
                    ? 'border-gray-700 hover:border-[#00E5FF] hover:text-[#00E5FF] hover:shadow-[0_0_10px_rgba(0,229,255,0.2)]' 
                    : 'border-gray-300 hover:border-blue-600 hover:text-blue-600'
                }`}
              >
                {address.slice(0,5)}...{address.slice(-4)}
              </button>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
            Yield on Bitcoin. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-blue-500">
              Locked by code.
            </span>
          </h2>
          <p className={`text-lg md:text-xl mb-12 max-w-2xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            The world’s first lending protocol that cryptographically guarantees every vault is an exact, audited, immutable template.
          </p>

          <div className={`w-full max-w-md p-8 rounded-3xl border backdrop-blur-xl transition-all duration-500 ${
            theme === 'dark' 
              ? 'bg-white/[0.02] border-white/10 shadow-[0_8px_32px_rgba(0,229,255,0.05)]' 
              : 'bg-white border-gray-100 shadow-2xl'
          }`}>
            {!userSession.isUserSignedIn() ? (
              <ConnectWallet onConnect={handleConnect} theme={theme} />
            ) : (
              <SupplyWithdraw address={address} theme={theme} />
            )}
          </div>
        </main>

        <footer className="mt-32 text-center pb-8">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase ${
            theme === 'dark' ? 'bg-white/5 text-gray-400' : 'bg-black/5 text-gray-500'
          }`}>
            <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse"></span>
            Mainnet • Clarity 4 • No Admin Keys
          </div>
        </footer>

      </div>
    </div>
  )
}
