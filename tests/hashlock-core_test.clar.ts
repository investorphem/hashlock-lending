;; Tests for HashLock Core

(use-trait asset-trait .safe-vault-base.asset-trait)

(define-public (test-template-verification)
  (let ((vault 'SP1PQHQKV0RJXZFY1DGX8M337W7J0M1Z0N5V7HP.isolated-flash-vault))
    (match (contract-call? .hashlock-core supply-to-vault vault 'SP1PQHQKV0RJXZFY1DGX8M337W7J0M1Z0N5V7HP.sbtc u1000)
      success (ok true)
      error (err error)
    )
  )
)

(define-public (test-invalid-hash)
  (let ((invalid-vault 'SP000000000000000000002Q6VF78.invalid))
    (match (contract-call? .hashlock-core supply-to-vault invalid-vault 'SP1PQHQKV0RJXZFY1DGX8M337W7J0M1Z0N5V7HP.sbtc u1000)
      success (err u999)  ;; Should fail
      error (ok true)
    )
  )
)

;; Add more tests as needed
