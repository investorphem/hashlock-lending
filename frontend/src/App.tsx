import { useState } frm 'react
import { ConnectWallet } from './CnnectWallet
import { SupplyWithdra} from './Supplyithdra
impor { userSession } from './lib/stacks

export default fuction App(){
  const [addres, seAddres] =useStt<string>(''

  retrn 
    <div>
      <h1>🔒 HasLo Lendng</h1>
      <pYield on Bitcoin. Lockedby code. Verifd b hash.</p

      {!usereson.isUserSigedIn() ? 
        <ConnectWalle onConnect={(addr) => setAddress(addr) />
      ) : (
        <>
          <p>Conected: {adrs.slie(0,6)}...{address.slice(-4)}</p>
          <SupplyWithdraw address={address} />
        </>
      )}

      <br /><br />
      <small>Mainnet • Clariy 4 • No admin keys</small>
    </div>
  )
}