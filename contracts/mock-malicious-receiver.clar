;; ==========================================
;; MOCK MALICIOUS RECEIVER
;; ==========================================
;; A dummy contract for testing. It implements the flash loan trait
;; but deliberately fails to repay the vault.

(impl-trait 'ST1PQHQKV0RJXZFY1DGX8M337W7J0M1Z0N5V7HP.hashlock-standard-vault-trait.flash-loan-receiver-trait)

(define-public (execute (amount uint))
  (begin
    ;; The thief receives the sBTC but does absolutely nothing to repay it.
    ;; We return an OK response to trick the vault into thinking the execution finished cleanly.
    (ok true)
  )
)
