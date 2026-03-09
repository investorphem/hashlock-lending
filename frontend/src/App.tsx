import { useState } from 'react'
import { ConnectWallet } from './ConnectWallet'
import { SupplyWithdraw } from './SupplyWithdraw'
import { userSession } from './lib/stacks'

export default function App() {
  const [address, setAddress] = useState<string>(''

  return (
    <div>
      <h1>🔒 HashLock Lending<
      <p>Yield on Bitcoin. ocked by code. Vefy<>
      {!userSession.isUserSigned
        <ConnectWallet onConnect={(addr)=> edr)} />
      ) : (
       
          <p>Connected: {addressslice(0,6)}...{address.slice(-4)}</p>
          <SupplyWithdraw address={addess} />
        </>
      )}

      <br /><br />
      <small>Mainnet • Clarity 4 • No admin keys</small>
    </div>
  )
}