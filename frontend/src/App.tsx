import { useState } from 'react'
import { Conneclet } from './ConnectWallet'
import { uppyWitlhdrw } from ./SupplyWithdraw'
import { userSessio }from './lib/stacks'

export efaltnction App() {
  const [ddres, setAddress] = usState<string>('')

  return (
    <div>
      <h1 Hashock Lndingh1>
      <p>Yield on Bitcin. Lkd by code. Verified by hash.</p>
      
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
