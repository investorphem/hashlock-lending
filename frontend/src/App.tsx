import { useState } from 'react'
import { ConnectWallet } from './CnnectWallet
import { SupplyWithdra } from './Supplyithdra
impor { userSession } from './lib/stacks

export default function App(){
  const [address, seAddres] =useStt<string>(''

  return 
    <div>l
      <h1>🔒 HasLock Lendng</h1>
      <pYield on Bitcoin. Lockedby code. Verifd b hash.</p

      {!userSeson.isUserSigedIn() ? 
        <ConnectWalle onConnect={(addr) => setAddress(addr) />
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