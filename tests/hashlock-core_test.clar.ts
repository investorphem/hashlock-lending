import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

// Standard simulated accounts provided by Clarinet
const deployer = "ST1PQHQKV0RJXZFY1DGX8M337W7J0M1Z0N5V7HP";
const user1 = "ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5";
const attacker = "ST2CY5V39NHDPWSXWH9QLS391IPC0TERX5QL8XNDN";

const CORE_CONTRACT = `${deployer}.hashlock-core`;
const VALID_VAULT = `${deployer}.hashlock-isolated-sbtc-v1`;
const INVALID_VAULT = `${attacker}.fake-vault`;

describe("HashLock Core: Template Verification", () => {
  
  it("✅ succeeds when supplying to a whitelisted, hash-verified vault", () => {
    // 1. Arrange: User supplies 1000 sBTC
    const amount = Cl.uint(1000);
    const vault = Cl.contractPrincipal(deployer, "hashlock-isolated-sbtc-v1");

    // 2. Act: Call the supply function on the core contract
    const receipt = simnet.callPublicFn(
      CORE_CONTRACT.split('.')[1],
      "supply",
      [vault, amount],
      user1
    );

    // 3. Assert: Transaction should be completely successful (ok true)
    expect(receipt.events.length).toBeGreaterThan(0); // Should emit transfer events
    expect(receipt.result).toBeOk(Cl.bool(true));
  });

  it("❌ fails with ERR-HASH-MISMATCH (u101) when vault bytecode is spoofed", () => {
    // 1. Arrange: Attacker tries to use a fake vault
    const amount = Cl.uint(1000);
    const fakeVault = Cl.contractPrincipal(attacker, "fake-vault");

    // 2. Act: Call the supply function
    const receipt = simnet.callPublicFn(
      CORE_CONTRACT.split('.')[1],
      "supply",
      [fakeVault, amount],
      user1
    );

    // 3. Assert: The protocol must reject the transaction
    expect(receipt.result).toBeErr(Cl.uint(101)); // ERR-HASH-MISMATCH
  });

  it("❌ fails with ERR-NOT-WHITELISTED (u100) for unknown templates", () => {
    // 1. Arrange: Try to use a completely unknown vault template
    const amount = Cl.uint(1000);
    const unknownVault = Cl.contractPrincipal(user1, "random-unknown-vault");

    // 2. Act: Call the supply function
    const receipt = simnet.callPublicFn(
      CORE_CONTRACT.split('.')[1],
      "supply",
      [unknownVault, amount],
      user1
    );

    // 3. Assert: The protocol must reject with ERR-NOT-WHITELISTED
    expect(receipt.result).toBeErr(Cl.uint(100)); // ERR-NOT-WHITELISTED
  });
});
