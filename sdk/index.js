const { makeSTXTokenTransfer, broadcastTransaction } = require("@stacks/transactions");
const { StacksMainnet, StacksTestnet } = require("@stacks/network");
const CryptoJS = require("crypto-js");

class HashlockClient {
  constructor({ network = "mainnet", wallet = null } = {}) {
    this.network = network === "mainnet" ? new StacksMainnet() : new StacksTestnet();
    this.wallet = wallet; // Wallet integration placeholder (Xverse/Leather)
    this.loans = new Map(); // Off-chain loan registry for simplicity
  }

  // Generate hash from preimage
  static generateHash(preimage) {
    return CryptoJS.SHA256(preimage).toString(CryptoJS.enc.Hex);
  }

  // Create a loan
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

  // Repay loan
  async repayLoan(loanId, preimage) {
    const loan = this.loans.get(loanId);
    if (!loan) throw new Error("Loan not found");
    if (loan.repaid) throw new Error("Already repaid");

    const hash = HashlockClient.generateHash(preimage);
    if (hash !== loan.preimageHash) throw new Error("Invalid preimage");

    loan.repaid = true;
    return true;
  }

  // Get loan status
  async getLoanStatus(loanId) {
    return this.loans.get(loanId) || null;
  }

  // Example: send STX tokens (stub)
  async sendSTX({ senderKey, recipient, amount }) {
    const txOptions = {
      recipient,
      amount,
      senderKey,
      network: this.network
    };
    const tx = await makeSTXTokenTransfer(txOptions);
    return broadcastTransaction(tx, this.network);
  }
}

module.exports = { HashlockClient };