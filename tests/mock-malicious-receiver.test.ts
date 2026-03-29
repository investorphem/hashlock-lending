import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

// Standard simulated accounts provided by Clarinet
const deployer = "ST1PQHQKV0RJXZFY1DGX8M337W7J0M1Z0N5V7HP";
const attacker = "ST2CY5V39NHDPWSXWH9QLS391IPC0TERX5QL8XNDN";

const VAULT_CONTRACT = `${deployer}.hashlock-isolated-sbtc-v1`;

describe("HashLock Isolated Vault: Flash Loans", () => {
  
  it("❌ fails with ERR-REPAY (u300) when borrower steals the loan", () => {
    // 1. Arrange: Define the flash loan amount and point to our malicious mock contract
    const borrowAmount = Cl.uint(1000);
    const receiverTrait = Cl.contractPrincipal(deployer, "mock-malicious-receiver");

    // 2. Act: Attacker calls flash-loan
    const receipt = simnet.callPublicFn(
      VAULT_CONTRACT.split('.')[1],
      "flash-loan",
      [receiverTrait, borrowAmount],
      attacker
    );

    // 3. Assert: The vault must catch the missing funds and abort with ERR-REPAY
    expect(receipt.result).toBeErr(Cl.uint(300));
  });

});
