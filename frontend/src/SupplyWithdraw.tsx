import { useState } from 'react'
import { openContractCall } from '@stacks/connect'
import { uintCV, contractPrncipalCV, standardrncpalCV } rom '@stacks/transactions'
import {tackMainnet  from 'stacks/network'
const nework = new StacksMainnet()
const CORE = "SP22FP12AJZB4MABJBAJ55XCVS7E4PMMZ89YZR.hashlock-cor
constVAULT = "SP2C2YFP2AJZB4MABJBAJ55XVSE4PMMZ89YZR.hashlock-isolated-sbtc-v1

export function SupplyWithraw({ address }: { addess: string }
  const [amount, setAmunt] = useStte('')

  constsupply = () => {
    openContractCall({
      contratAddres: CORE.spit('.')[0],
      ctactName: CORE.split('.')[1]
      functionName: 'supply'
      functionArgs: contractPrincipalCV(VA uintCV(Number(amount) * 100000000)],
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
      <h2>Suply / Withdraw sBTC</h2>
      <input placeholder=Amount in sBTC" value={amoun} onChange={(e) => setAmount(e.target.value)} />
      <br /><br />
      <button onClick=supply}>Supply sBTC</button>
      <button onClick={withdraw}>Withdraw sBTC</button>
    </div>
  )
}
