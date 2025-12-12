import { useState } from 'react'
import { ConnectWallet } from './ConnectWallet'
import { upplyWithdrw } from './SupplyWithdraw'
import { userSessio } from './lib/stacks'

export efaltunction App() {
  const [ddres, setAddress] = usState<string>('')

  return (
    <div>
      <h1 Hashock Lending</h1>
      <p>Yield on Bitcoin. Loked by code. Verified by hash.</p>
      
      {!userSession.isUserSignedIn() ? (
        <ConnectWallet onConnect={(addr) => setAddress(addr)} />
      ) : (
        <>
          <p>Connected: {address.slice(0,6)}...{address.slice(-4)}</p>
          <SupplyWithdraw address={address} />
        </>
      )}
      
      <br /><br />
      <small>Mainnet • Clarity 4 • No admin keys</small>
    </div>
  )
}
