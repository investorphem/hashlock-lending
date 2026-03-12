const CryptoJS = require("crypto-js");
const {
  makeSTXTokenTransfer,
  broadcastTransaction,
  bufferCV,
  uintCV,
  standardPrincipalCV,
  callReadOnlyFunction,
  callPublicFunction
} = require("@stacks/transactions");
const { StacksMainnet, StacksTestnet } = require("@stacks/network");
const { AppConfig, UserSession, showConnect } = require("@stacks/connect");

class HashlockClient {
  constructor({ network = "mainnet", walletType = null } = {}) {
    this.network = network === "mainnet" ? new StacksMainnet() : new StacksTestnet();
    this.walletType = walletType; // 'xverse' or 'leather'
    this.userSession = null;
    this.loans = new Map();
  }

  // Generate hash from preimage
  static generateHash(preimage) {
    return CryptoJS.SHA256(preimage).toString(CryptoJS.enc.Hex);
  }

  // Connect wallet (Xverse or Leather)
  async connectWallet({ appName = "HashLock Lending SDK" } = {}) {
    const appConfig = new AppConfig(['store_write', 'publish_data']);
    this.userSession = new UserSession({ appConfig });

    if (!this.userSession.isUserSignedIn()) {
      await showConnect({
        appDetails: { name: appName, icon: "" },
        redirectTo: "/",
        onFinish: ({ userSession }) => {
          this.userSession = userSession;
          console.log("Wallet connected:", userSession.loadUserData().profile.stxAddress.mainnet);
        }
      });
    }
  }

  // Create a hashlocked loan (off-chain registry for now)
  async createLoan({ loanId, borrower, lender, amount, preimage, expiry }) {
    if (this.loans.has(loanId)) throw new Error("Loan ID exists");

    const preimageHash = HashlockClient.generateHash(preimage);

    this.loans.set(loanId, {
      borrower,
      lender,
      amount,
      preimageHash,
      expiry: expiry || Date.now() + 3600 * 1000,
      repaid: false
    });

    return loanId;
  }

  // Repay a loan
  async repayLoan(loanId, preimage) {
    const loan = this.loans.get(loanId);
    if (!loan) throw new Error("Loan not found");
    if (loan.repaid) throw new Error("Loan already repaid");

    const hash = HashlockClient.generateHash(preimage);
    if (hash !== loan.preimageHash) throw new Error("Invalid preimage");

    loan.repaid = true;
    return true;
  }

  // Get loan status
  async getLoanStatus(loanId) {
    return this.loans.get(loanId) || null;
  }

  // Send STX via connected wallet
  async sendSTX({ recipient, amount }) {
    if (!this.userSession || !this.userSession.isUserSignedIn()) {
      throw new Error("Wallet not connected");
    }

    const senderKey = this.userSession.loadUserData().profile.stxAddress.mainnet;
    const txOptions = {
      recipient,
      amount,
      senderKey,
      network: this.network
    };

    const tx = await makeSTXTokenTransfer(txOptions);
    return broadcastTransaction(tx, this.network);
  }

  // Example: Call a read-only Clarity contract function
  async callReadOnly({ contractAddress, contractName, functionName, functionArgs = [] }) {
    return callReadOnlyFunction({
      contractAddress,
      contractName,
      functionName,
      functionArgs,
      network: this.network,
      senderAddress: this.userSession?.loadUserData().profile.stxAddress.mainnet
    });
  }

  // Example: Call a public Clarity contract function (on-chain)
  async callPublicFunction({ contractAddress, contractName, functionName, functionArgs = [], postConditionMode = 1 }) {
    if (!this.userSession || !this.userSession.isUserSignedIn()) {
      throw new Error("Wallet not connected");
    }

    const txOptions = {
      contractAddress,
      contractName,
      functionName,
      functionArgs,
      senderKey: this.userSession.loadUserData().appPrivateKey,
      network: this.network,
      postConditionMode
    };

    return callPublicFunction(txOptions);
  }
}

module.exports = { HashlockClient };