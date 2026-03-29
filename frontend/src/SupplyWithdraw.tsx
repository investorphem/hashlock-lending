import { useState } from 'react'
import { openContractCall } from '@stacks/connect'
import { uintCV, contractPrincipalCV } from '@stacks/transactions'
import { StacksMainnet } from '@stacks/network'
import { toast } from 'sonner'
import { ArrowDownRight, ArrowUpRight, ExternalLink } from 'lucide-react'

const network = new StacksMainnet()
// Stacks Explorer base URL for premium toast links
const EXPLORER_URL = 'https://explorer.hiro.so/txid/' 

const CORE = "SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.hashlock-core"
const VAULT = "SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.hashlock-isolated-sbtc-v1"

interface SupplyWithdrawProps {
  address: string
  theme?: 'dark' | 'light'
}

export function SupplyWithdraw({ address, theme = 'dark' }: SupplyWithdrawProps) {
  const [amount, setAmount] = useState('')

  // Helper to handle the transaction success toast
  const handleTxSuccess = (txId: string, action: string) => {
    toast.success(`${action} Transaction Submitted!`, {
      icon: '🔒',
      style: { 
        background: theme === 'dark' ? '#0A1118' : '#fff', 
        color: '#4ADE80', 
        borderColor: '#4ADE80' 
      },
      description: (
        <a 
          href={`${EXPLORER_URL}0x${txId}?chain=mainnet`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-1 mt-1 text-[#00E5FF] hover:underline"
        >
          View on Explorer <ExternalLink size={14} />
        </a>
      ),
    })
  }

  const supply = () => {
    if (!amount || Number(amount) <= 0) return toast.error('Enter a valid amount')
    
    openContractCall({
      contractAddress: CORE.split('.')[0],
      contractName: CORE.split('.')[1],
      functionName: 'supply',
      functionArgs: [
        contractPrincipalCV(VAULT.split('.')[0], VAULT.split('.')[1]), 
        uintCV(Math.floor(Number(amount) * 100000000))
      ],
      network,
      onFinish: (data) => handleTxSuccess(data.txId, 'Supply'),
      onCancel: () => toast('Transaction Cancelled')
    })
  }

  const withdraw = () => {
    if (!amount || Number(amount) <= 0) return toast.error('Enter a valid amount')

    openContractCall({
      contractAddress: CORE.split('.')[0],
      contractName: CORE.split('.')[1],
      functionName: 'withdraw',
      functionArgs: [uintCV(Math.floor(Number(amount) * 100000000))],
      network,
      onFinish: (data) => handleTxSuccess(data.txId, 'Withdraw'),
      onCancel: () => toast('Transaction Cancelled')
    })
  }

  return (
    <div className="flex flex-col w-full">
      {/* Input Section */}
      <div className={`mb-8 p-6 rounded-2xl transition-colors duration-500 ${
        theme === 'dark' ? 'bg-[#1A202C]/50 border border-gray-800' : 'bg-gray-50 border border-gray-200'
      }`}>
        <div className="flex justify-between items-center mb-2">
          <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Amount
          </span>
          <span className={`text-xs font-mono ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
            sBTC
          </span>
        </div>
        
        <div className="flex items-center">
          <input 
            type="number"
            placeholder="0.00" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            className={`w-full bg-transparent text-5xl font-extrabold outline-none tracking-tight transition-colors placeholder:text-gray-600 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button 
          onClick={supply}
          className={`flex-1 flex justify-center items-center gap-2 py-4 rounded-xl font-bold transition-all duration-300 ${
            theme === 'dark' 
              ? 'bg-[#00E5FF] text-[#0A1118] hover:bg-[#4ADE80] hover:shadow-[0_0_20px_rgba(74,222,128,0.4)]' 
              : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
          }`}
        >
          <ArrowDownRight size={20} />
          Supply
        </button>

        <button 
          onClick={withdraw}
          className={`flex-1 flex justify-center items-center gap-2 py-4 rounded-xl font-bold border transition-all duration-300 ${
            theme === 'dark' 
              ? 'bg-transparent text-white border-gray-700 hover:border-[#00E5FF] hover:text-[#00E5FF]' 
              : 'bg-white text-blue-600 border-blue-200 hover:border-blue-600 hover:bg-blue-50'
          }`}
        >
          <ArrowUpRight size={20} />
          Withdraw
        </button>
      </div>
    </div>
  )
}
