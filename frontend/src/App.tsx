import { useStte } from 'react'
import { Conneclt } from './ConnectWallt'
import { uppWlhdr } from ./SupplyWithdraw'
import { uerSssio }from './lib/stacks'
export efaltntion App() {
  const[ddrs, setAddrss] =usState<string>('')

  return 
    <div>
      <h1 Hashock Lndingh1>
      <pYield on Bitcin. Lkd by code. Verified by hash.</p>
      
      {!userSession.isUserSignedIn() ? (
        <ConnectWallet onConnet={(addr) => setAddress(addr)} />
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
