import { useState } from 'react'
import { openContractCall } from '@stacks/connect'
import { uintCV, contractPrincipalCV } from '@stacks/transactions'
import { toast } from 'sonner'
import { ArrowDownRight, ArrowUpRight, ExternalLink, ShieldCheck } from 'lucide-react'
import { network } from './lib/stacks' // Centralized network config

const EXPLORER_URL = 'https://explorer.hiro.so/txid/' 
const CORE = "SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.hashlock-core"
const VAULT = "SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.hashlock-isolated-sbtc-v1"

interface SupplyWithdrawProps {
  address: string
  theme?: 'dark' | 'light'
}

export function SupplyWithdraw({ address, theme = 'dark' }: SupplyWithdrawProps) {
  const [amount, setAmount] = useState('')

  const handleTxSuccess = (txId: string, action: string) => {
    toast.success(`${action} Submitted`, {
      description: (
        <a 
          href={`${EXPLORER_URL}${txId}?chain=mainnet`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 mt-2 text-[#00E5FF] font-bold hover:underline"
        >
          View on Explorer <ExternalLink size={14} />
        </a>
      ),
      style: { 
        background: theme === 'dark' ? '#0A1118' : '#fff', 
        borderColor: '#4ADE80' 
      },
    })
  }

  const executeTx = (functionName: 'supply' | 'withdraw') => {
    if (!amount || Number(amount) <= 0) return toast.error('Enter a valid amount')
    
    // Convert to 8-decimal fixed point for sBTC
    const microAmount = Math.floor(Number(amount) * 100_000_000)

    openContractCall({
      contractAddress: CORE.split('.')[0],
      contractName: CORE.split('.')[1],
      functionName,
      functionArgs: functionName === 'supply' 
        ? [contractPrincipalCV(VAULT.split('.')[0], VAULT.split('.')[1]), uintCV(microAmount)]
        : [uintCV(microAmount)],
      network,
      onFinish: (data) => handleTxSuccess(data.txId, functionName === 'supply' ? 'Supply' : 'Withdraw'),
      onCancel: () => toast.info('Transaction Cancelled')
    })
  }

  return (
    <div className="flex flex-col w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Protocol Badge */}
      <div className="flex items-center gap-2 mb-6 px-3 py-1.5 rounded-lg bg-[#00E5FF]/5 border border-[#00E5FF]/20 w-fit">
        <ShieldCheck size={14} className="text-[#00E5FF]" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#00E5FF]">
          Hash-Verified Vault v1
        </span>
      </div>

      {/* Input Section */}
      <div className={`group mb-8 p-8 rounded-3xl transition-all duration-300 border-2 ${
        theme === 'dark' 
          ? 'bg-black/40 border-white/5 focus-within:border-[#00E5FF]/30' 
          : 'bg-slate-50 border-slate-100 focus-within:border-blue-500/30'
      }`}>
        <div className="flex justify-between items-end">
          <div className="flex flex-col">
            <label className={`text-xs font-bold uppercase tracking-tighter mb-4 ${
              theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
            }`}>
              Amount to Move
            </label>
            <input 
              type="number"
              placeholder="0.00" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              className={`bg-transparent text-6xl font-black outline-none tracking-tighter w-full placeholder:text-slate-700 ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}
            />
          </div>
          <div className={`pb-2 text-xl font-black italic tracking-widest ${
            theme === 'dark' ? 'text-[#00E5FF]' : 'text-blue-600'
          }`}>
            sBTC
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => executeTx('supply')}
          className={`flex justify-center items-center gap-2 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 ${
            theme === 'dark' 
              ? 'bg-[#00E5FF] text-[#0A1118] hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] hover:scale-[1.02]' 
              : 'bg-blue-600 text-white hover:shadow-xl hover:bg-blue-700 hover:scale-[1.02]'
          }`}
        >
          <ArrowDownRight size={18} />
          Supply
        </button>

        <button 
          onClick={() => executeTx('withdraw')}
          className={`flex justify-center items-center gap-2 py-5 rounded-2xl font-black text-sm uppercase tracking-widest border-2 transition-all duration-300 ${
            theme === 'dark' 
              ? 'bg-transparent text-white border-white/10 hover:border-[#00E5FF] hover:text-[#00E5FF] hover:bg-[#00E5FF]/5' 
              : 'bg-white text-slate-900 border-slate-200 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50'
          }`}
        >
          <ArrowUpRight size={18} />
          Withdraw
        </button>
      </div>

      {/* Connected Status */}
      <div className="mt-8 text-center">
        <p className={`text-[10px] font-medium tracking-wide ${theme === 'dark' ? 'text-slate-600' : 'text-slate-400'}`}>
          Connected as <span className="font-mono text-slate-500">{address.slice(0, 12)}...{address.slice(-4)}</span>
        </p>
      </div>
    </div>
  )
}
