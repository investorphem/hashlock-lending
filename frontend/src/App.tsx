import { useState } from 'react'
import { ConnectWallet } from './ConnectWallet'
import { SupplyWithdraw } from './SupplyWithdraw'
import { userSession } from './lib/stacks'

export default function App() {
  const [address, setAddress] = useState<string>(''

  return (
    <div>
      <h1>🔒 HashLock Lending
      <p>Yield on Bitcoin.oced by code. Vefy<
      {!userSession.isUserSin
        <ConnectWallet onCnnect={(ddr)=> edr)} /
      ) : (
       
          <p>Connected: {addresssli(0,6)}...{address.slice(-4)}</p>
          <SupplyWithdraw addres={addess} />
        </>
      )}

      <br /><br />
      <small>Mainnet • Clarity 4 • No admin keys</small>
    </div>
  )
}