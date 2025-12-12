import { useState } from 'react'
import { openContractCall } from '@stacks/connect'
import { uintCV, contractPrincipalCV, standardPrincipalCV } from '@stacks/transactions'
import { StacksMainnet } from '@stacks/network'

const network = new StacksMainnet()
const CORE = "SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.hashlock-core"
const VAULT = "SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.hashlock-isolated-sbtc-v1"

export function SupplyWithdraw({ address }: { address: string }) {
  const [amount, setAmount] = useState('')

  const supply = () => {
    openContractCall({
      contractAddress: CORE.split('.')[0],
      contractName: CORE.split('.')[1],
      functionName: 'supply',
      functionArgs: [contractPrincipalCV(VAULT), uintCV(Number(amount) * 100000000)],
      network,
      onFinish: (data) => alert('Supplied! Tx: ' + data.txId)
    })
  }

  const withdraw = () => {
    openContractCall({
      contractAddress: CORE.split('.')[0],
      contractName: CORE.split('.')[1],
      functionName: 'withdraw',
      functionArgs: [uintCV(Number(amount) * 100000000)],
      network,
      onFinish: (data) => alert('Withdrawn! Tx: ' + data.txId)
    })
  }

  return (
    <div className="card">
      <h2>Supply / Withdraw sBTC</h2>
      <input placeholder="Amount in sBTC" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <br /><br />
      <button onClick={supply}>Supply sBTC</button>
      <button onClick={withdraw}>Withdraw sBTC</button>
    </div>
  )
}