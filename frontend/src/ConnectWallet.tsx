import { AppConfig, UserSession, showConnect } from '@stacks/connect'
import { userSession } from './lib/stacks'

const appConfig = new AppConfig(['store_write', 'publish_data'])
const session = new UserSession({ appConfig })

export function ConnectWallet({ onConnect }: { onConnect: (addr: string) => void }) {
  const handleConnect = () => {
    showConnect({
      appDetails: { name: 'HashLock Lending', icon: window.location.origin + '/favicon.svg' },
      onFinish: () => {
        const userData = session.loadUserData()
        onConnect(userData.profile.stxAddress.mainnet)
      }
    })
  }

  return <button onClick={handleConnect}>Connect Wallet (Leather / Xverse)</button>
}
