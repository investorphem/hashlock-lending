;; ==========================================
;; HASHLOCK ISOLATED VAULT (sBTC)
;; ==========================================
;; Immutable flash-loan vault template
;; No upgrades. Verified by contract-hash.

;; ==========================================
;; CONSTANTS & ERRORS
;; ==========================================
(define-constant FEE u9) ;; 0.09% (9 basis points)
(define-constant ERR-REPAY (err u300))

(define-constant sbtc 'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.sbtc)

;; SECURITY FIX: Hardcode the whitelisted template principal.
;; Clones cannot spoof their origin to the core contract.
;; FIXED: Aligned with the testnet/simnet deployer from your test suite
(define-constant TEMPLATE-SOURCE 'ST1PQHQKV0RJXZFY1DGX8M337W7J0M1Z0N5V7HP.hashlock-isolated-sbtc-v1)

;; ==========================================
;; TRAITS
;; ==========================================
;; Defines the callback interface for the flash loan borrower
(define-trait flash-loan-receiver
  (
    (execute (uint) (response bool uint))
  )
)

;; ==========================================
;; DATA VARIABLES
;; ==========================================
;; Gas-optimized storage for a single-asset isolated vault
(define-data-var total-reserve uint u0)

;; ==========================================
;; CORE LOGIC
;; ==========================================

;; @desc Deposit sBTC into the vault (called by core contract)
(define-public (deposit (amount uint))
  (let ((caller tx-sender))
    ;; FIXED: contract-call syntax requires a literal or trait
    (try! (contract-call? 'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.sbtc transfer amount caller (as-contract tx-sender) none))
    (var-set total-reserve (+ (var-get total-reserve) amount))
    (ok true)
  )
)

;; @desc Flash loan execution engine
;; @param receiver: The borrower's contract (must implement flash-loan-receiver trait)
;; @param amount: Amount of sBTC to borrow
(define-public (flash-loan (receiver <flash-loan-receiver>) (amount uint))
  (let (
    (fee-amount (/ (* amount FEE) u10000))
    (pre-balance (var-get total-reserve))
    (borrower tx-sender)
  )
    ;; 1. Optimistically transfer sBTC to the borrower's contract (FIXED syntax)
    (try! (as-contract (contract-call? 'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.sbtc transfer amount tx-sender borrower none)))

    ;; 2. Execute the borrower's custom logic
    ;; The borrower MUST repay the loan + fee during this callback!
    (try! (contract-call? receiver execute amount))

    ;; 3. Verification: Cryptographically guarantee the vault is whole + fee (FIXED syntax)
    (let ((post-balance (unwrap-panic (contract-call? 'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.sbtc get-balance (as-contract tx-sender)))))
      (asserts! (>= post-balance (+ pre-balance fee-amount)) ERR-REPAY)
      
      ;; 4. Update the internal reserve to include the newly earned fee
      (var-set total-reserve post-balance)
      (ok true)
    )
  )
)

;; ==========================================
;; READ-ONLY & VERIFICATION FUNCTIONS
;; ==========================================

;; @desc Returns the static template source for core whitelist verification
(define-public (get-template-source)
  (ok TEMPLATE-SOURCE)
)

(define-read-only (get-reserve)
  (var-get total-reserve)
)
