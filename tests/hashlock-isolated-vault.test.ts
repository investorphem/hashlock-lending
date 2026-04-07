import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

// Standard simulated accounts provided by Clarinet
const deployer = "ST1PQHQKV0RJXZFY1DGX8M337W7J0M1Z0N5V7HP";
const user1 = "ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5";
const attacker = "ST2CY5V39NHDPWSXWH9QLS391IPC0TERX5QL8XNDN";

const VAULT_CONTRACT = `${deployer}.hashlock-isolated-sbtc-v1`;
const CORE_CONTRACT = `${deployer}.hashlock-core`;

describe("HashLock Isolated Vault: Flash Loans", () => {
  
  it("❌ fails with ERR-REPAY (u300) when borrower steals the loan", () => {
    // 1. Arrange: Provide initial liquidity so the vault can actually send the loan
    simnet.callPublicFn(VAULT_CONTRACT.split('.')[1], "deposit", [Cl.uint(500000)], deployer);

    // 100,000 sBTC loan
    const borrowAmount = Cl.uint(100000); 
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

  it("✅ succeeds and absorbs fee when borrower repays the loan", () => {
    // 1. Arrange: Deposit 500,000 initial liquidity
    simnet.callPublicFn(VAULT_CONTRACT.split('.')[1], "deposit", [Cl.uint(500000)], deployer);
    
    // 100,000 sBTC loan -> Fee should be 90 sBTC
    const borrowAmount = Cl.uint(100000); 
    const receiverTrait = Cl.contractPrincipal(deployer, "mock-profitable-receiver");

    // 2. Act: User executes a profitable flash loan
    const receipt = simnet.callPublicFn(
      VAULT_CONTRACT.split('.')[1],
      "flash-loan",
      [receiverTrait, borrowAmount],
      user1
    );

    // 3. Assert: Transaction should succeed
    expect(receipt.result).toBeOk(Cl.bool(true));

    // 4. Assert: Reserve should have increased by the 0.09% fee
    // 500,000 (initial) + 90 (fee) = 500,090
    const postReserve = simnet.callReadOnlyFn(VAULT_CONTRACT.split('.')[1], "get-reserve", [], deployer);
    expect(postReserve.result).toEqual(Cl.uint(500090));
  });

});

describe("HashLock Isolated Vault: Core Routing", () => {
  
  it("✅ accurately routes deposits from core to vault reserve", () => {
    // 1. Arrange: 50,000 sBTC deposit
    const supplyAmount = Cl.uint(50000);
    const vaultTrait = Cl.contractPrincipal(deployer, "hashlock-isolated-sbtc-v1");

    // 2. Act: User supplies via the CORE contract
    const receipt = simnet.callPublicFn(
      CORE_CONTRACT.split('.')[1],
      "supply",
      [vaultTrait, supplyAmount],
      user1
    );

    // 3. Assert: Transaction succeeds
    expect(receipt.result).toBeOk(Cl.bool(true));

    // 4. Assert: The vault's actual reserve should have increased by the supply amount
    const postReserve = simnet.callReadOnlyFn(VAULT_CONTRACT.split('.')[1], "get-reserve", [], deployer);
    expect(postReserve.result).toEqual(Cl.uint(50000));
  });

});
