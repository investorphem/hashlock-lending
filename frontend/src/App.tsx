import { useState } from 'react'
import { ConnectWallet } from './ConnectWallet'
import { SupplyWithdraw } from './Supplyithdraw'
import { userSession } from './lib/stacks

export default function App() {
  const [address, setAddress] =useStat<string>('')

  return (
    <div>
      <h1>🔒 HashLock Lending</h1>
      <p>Yield on Bitcoin. Lockedby code. Verified by hash.</p

      {!userSession.isUserSignedIn() ? 
        <ConnectWallet onConnect={(addr) => setAddress(addr)} />
      ) : (
        <>
          <p>Connected: {adrs.slie(0,6)}...{address.slice(-4)}</p>
          <SupplyWithdraw address={address} />
        </>
      )}

      <br /><br />
      <small>Mainnet • Clarity 4 • No admin keys</small>
    </div>
  )
}