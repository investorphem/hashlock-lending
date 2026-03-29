import { useState, useEffect } from 'react'
import { ExternalLink, History, CheckCircle2, Clock, XCircle } from 'lucide-react'

interface Tx {
  tx_id: string
  tx_status: string
  contract_call: { function_name: string }
  burn_block_time_iso: string
}

interface TransactionHistoryProps {
  address: string
  theme?: 'dark' | 'light'
}

export function TransactionHistory({ address, theme = 'dark' }: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Tx[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // Fetch last 5 transactions for this user from Hiro API
        const res = await fetch(`https://api.mainnet.hiro.so/extended/v1/address/${address}/transactions?limit=5`)
        const data = await res.json()
        
        // Filter for HashLock Core interactions
        const hashlockTxs = data.results.filter((tx: any) => 
          tx.contract_call?.contract_id?.includes('hashlock-core')
        )
        setTransactions(hashlockTxs)
      } catch (err) {
        console.error("Failed to fetch history", err)
      } finally {
        setLoading(false)
      }
    }

    if (address) fetchHistory()
  }, [address])

  const getStatusIcon = (status: string) => {
    if (status === 'success') return <CheckCircle2 size={14} className="text-emerald-500" />
    if (status === 'pending') return <Clock size={14} className="text-amber-500 animate-pulse" />
    return <XCircle size={14} className="text-rose-500" />
  }

  return (
    <div className={`mt-12 w-full max-w-md mx-auto p-6 rounded-3xl border transition-all duration-500 ${
      theme === 'dark' ? 'bg-white/[0.01] border-white/5' : 'bg-slate-50 border-slate-200'
    }`}>
      <div className="flex items-center gap-2 mb-6">
        <History size={18} className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'} />
        <h4 className={`text-sm font-bold uppercase tracking-widest ${
          theme === 'dark' ? 'text-slate-200' : 'text-slate-700'
        }`}>
          Recent Activity
        </h4>
      </div>

      <div className="space-y-4">
        {loading ? (
          // Premium Skeleton Loader
          [1, 2, 3].map((i) => (
            <div key={i} className={`h-12 w-full rounded-xl animate-pulse ${
              theme === 'dark' ? 'bg-white/5' : 'bg-slate-200'
            }`} />
          ))
        ) : transactions.length > 0 ? (
          transactions.map((tx) => (
            <div key={tx.tx_id} className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-white/5' : 'bg-white shadow-sm'}`}>
                  {getStatusIcon(tx.tx_status)}
                </div>
                <div className="flex flex-col">
                  <span className={`text-sm font-bold capitalize ${
                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}>
                    {tx.contract_call.function_name}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(tx.burn_block_time_iso).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <a 
                href={`https://explorer.hiro.so/txid/${tx.tx_id}?chain=mainnet`}
                target="_blank"
                rel="noreferrer"
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'dark' ? 'hover:bg-[#00E5FF]/10 text-slate-500 hover:text-[#00E5FF]' : 'hover:bg-blue-50 text-slate-400 hover:text-blue-600'
                }`}
              >
                <ExternalLink size={14} />
              </a>
            </div>
          ))
        ) : (
          <p className="text-center py-4 text-xs font-medium text-slate-500 italic">
            No vault interactions found yet.
          </p>
        )}
      </div>
    </div>
  )
}
