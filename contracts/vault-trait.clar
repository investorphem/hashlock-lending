;; ==========================================
;; HASHLOCK STANDARD VAULT TRAIT
;; ==========================================
;; Defines the exact interface that all HashLock
;; whitelisted templates must implement.

(define-trait vault-trait
  (
    ;; 1. Security & Verification
    ;; Must return the exact deployed principal of the template
    ;; for contract-hash? verification by the core.
    (get-template-source () (response principal uint))

    ;; 2. Core Liquidity Mechanics
    ;; Must accept deposits of the underlying asset (e.g., sBTC)
    (deposit (uint) (response bool uint))

    ;; Must allow authorized withdrawals
    (withdraw (uint) (response bool uint))
    
    ;; 3. State Reading
    ;; Returns the current reserve balance of the vault
    (get-reserve () (response uint uint))
  )
)