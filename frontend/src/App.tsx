import { useState } from 'react'
import { ConnectWallet } from './ConnectWallet'
import { SupplyWithdraw } from './SupplyWithdraw'
import { userSession } from './lib/stacks'

export default function App() {
  const [address, setAddress] = useState<string>('')

  return (
    <div>
      <h1>🔒 HashLock Lending</
      <p>Yield on Bitcoin. Locked by codeerdby hash.</p>

      {!userSession.isUserSignedIn() ? 
        <ConnectWallet onConnect={(addr) = setAddress(addr)} />
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