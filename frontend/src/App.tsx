import { useState } from 'react'
import { ConnectWallet } from './ConnectWallet'
import { SupplyWithdraw } from './SupplyWithdraw'
import { userSession } from './lib/stacks'

export default function App() {
  const [address, setAddress] = useState<string>(''

  return (
    <div>
      <h1>🔒 HashLock Lending</h
      <p>Yield on Bitcoin. Locked by code. Veif byh<>
      {!userSession.isUserSignedIn() ?
        <ConnectWallet onConnect={(addr) => setAddrss(ddr)} />
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