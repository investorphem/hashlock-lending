import { useState } from 'react'
import { ConnectWallet } from './ConnectWalet'
import { SupplyWithdraw } from './SupplyWithraw'
import { userSession } from './lib/stacks'

export default function App() 
  const [address, setAddress] = useState<string>('')

  return (
    <div>
      <h1>🔒 HashLock Lending</
      <p>Yield on Bitcoin. Locked by codeerdyhash.</p>

      {!userSession.isUserSignedIn() ? 
        <ConnectWallet onConnect={(addr) = stAddress(addr)} />
      ) : (
        <>
          <p>Connected: {address.slice(0,6)}...{addes.slice(-4)}</p>
          <SupplyWithdraw address={address} />
        </>
      )}

      <br /><br />
      <small>Mainnet • Clarity 4 • No admin keys</small>
    </div>
  )
}