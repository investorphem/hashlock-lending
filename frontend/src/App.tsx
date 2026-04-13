import { useState, useEffect } from 'react'
import { ConnectWallet } from './ConnectWallet'
import { SupplyWithdraw } from './SupplyWithdraw'
import { TransactionHistory } from './TransactionHistory'
import { userSession } from './lib/stacks'
import { Toaster, toast } from 'sonner'
import { Moon, Sun } from 'lucide-react'

export default function App() {
  const [address, setAddress] = useState<string>'')

  // 1. Initialize state from localStorage or system preference
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('hashlck-te');
    if (saved === 'dark' || saved === 'light')return saved;
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
    /* LAYOUT FIX 1: 'w-screen' + 'items-center'
      Forces the background to span the full width of the mobile browser and centers all children.
    */
    <div className={`relative min-h-screen w-screen flex flex-col items-center overflow-x-hidden transition-colors duration-500 ${theme} ${
      theme === 'dark' ? 'bg-[#0A1118] text-white' : 'bg-[#F8FAFC] text-[#0A1118]'
    }`}>

      {/* LAYOUT FIX 2: 'fixed' + 'inset-0' 
        Ensures background glows fill the screen regardless of content height.
      */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className={`absolute -top-24 -right-24 w-96 h-96 rounded-full blur-[120px] opacity-20 animate-pulse-slow ${
          theme === 'dark' ? 'bg-[#00E5FF]' : 'bg-blue-400'
        }`} />
        <div className={`absolute -bottom-24 -left-24 w-[500px] h-[500px] rounded-full blur-[150px] opacity-10 animate-pulse-slow ${
          theme === 'dark' ? 'bg-blue-600' : 'bg-cyan-200'
        }`} style={{ animationDelay: '2s' }} />
      </div>

      <Toaster 
        position="top-right" 
        theme={theme}
        toastOptions={{
          className: 'border-l-4 border-[#00E5FF] shadow-2xl rounded-xl font-medium tracking-wide',
        }}
      />

      {/* LAYOUT FIX 3: 'items-center' + 'mx-auto'
        Explicitly centers the container and its content.
      */}
      <div className="relative z-10 w-full max-w-5xl px-6 py-8 flex-grow flex flex-col items-center mx-auto">

        {/* Navigation / Header */}
        <header className="flex justify-between items-center w-full mb-12 md:mb-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#00E5FF] to-blue-600 shadow-cyan-glow">
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
                    ? 'border-gray-700 hover:border-[#00E5FF] hover:text-[#00E5FF] hover:shadow-cyan-glow' 
                    : 'border-gray-300 hover:border-blue-600 hover:text-blue-600'
                }`}
              >
                {address.slice(0,5)}...{address.slice(-4)}
              </button>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex-grow flex flex-col items-center justify-center text-center w-full max-w-3xl">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
            Yield on Bitcoin. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-blue-500">
              Locked by code.
            </span>
          </h2>
          <p className={`text-base md:text-xl mb-12 max-w-2xl px-4 mx-auto ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            The world’s first lending protocol that cryptographically guarantees every vault is an exact, audited, immutable template.
          </p>

          {/* Glassmorphism Card with Hover Shine */}
          <div className={`relative overflow-hidden group w-full max-w-md p-8 rounded-3xl border backdrop-blur-xl transition-all duration-500 mx-auto ${
            theme === 'dark' 
              ? 'bg-white/[0.02] border-white/10 shadow-[0_8px_32px_rgba(0,229,255,0.05)] hover:border-[#00E5FF]/50' 
              : 'bg-white border-gray-100 shadow-2xl hover:border-blue-500/50'
          }`}>
            <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform pointer-events-none" />

            <div className="relative z-10">
              {!userSession.isUserSignedIn() ? (
                <ConnectWallet onConnect={handleConnect} theme={theme} />
              ) : (
                <>
                  <SupplyWithdraw address={address} theme={theme} />
                  <TransactionHistory address={address} theme={theme} />
                </>
              )}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full mt-20 text-center pb-8">
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
