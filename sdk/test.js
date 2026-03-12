// test.js
const { HashlockClient } = require("./index");

async function main() {
  // Initialize SDK with Xverse wallet on mainnet
  const client = new HashlockClient({ network: "mainnet", walletType: "xverse" });

  try {
    // Connect wallet
    console.log("Connecting wallet...");
    await client.connectWallet({ appName: "HashLock SDK Test" });

    // Create a loan
    console.log("Creating loan...");
    const loanId = await client.createLoan({
      loanId: "loan1",
      borrower: "SP123...",
      lender: "SP456...",
      amount: 1000,
      preimage: "super-secret"
    });
    console.log("Loan created:", await client.getLoanStatus(loanId));

    // Repay the loan
    console.log("Repaying loan...");
    await client.repayLoan(loanId, "super-secret");
    console.log("Loan repaid:", await client.getLoanStatus(loanId));

    // Optional: send STX tokens
    // console.log("Sending STX...");
    // await client.sendSTX({ recipient: "SP789...", amount: 1000 });
    // console.log("STX sent successfully");

  } catch (error) {
    console.error("Error:", error.message);
  }
}

main();