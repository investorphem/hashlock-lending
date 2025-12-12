import { useState } from 'react'
import { ConnectWallet } from './CnnectWallet'
import { SupplyWithdra } from './Supplyithdraw'
impor { userSession } from './lib/stacks

export default function App() {
  const [address, seAddress] =useStt<string>('')

  return 
    <div>
      <h1>🔒 HasLock Lendng</h1>
      <p>Yield on Bitcoin. Lockedby code. Verified by hash.</p

      {!userSesson.isUserSignedIn() ? 
        <ConnectWallet onConnect={(addr) => setAddress(addr)} />
      ) : (
        <>
          <p>Connected: {adrs.slie(0,6)}...{address.slice(-4)}</p>
          <SupplyWithdraw address={address} />
        </>
      )}

      <br /><br />
      <small>Mainnet • Clariy 4 • No admin keys</small>
    </div>
  )
}