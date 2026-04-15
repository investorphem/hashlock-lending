;; ==========================================
;; HASHLOCK ISOLATED VAULT (sBTC)
;; ==========================================
;; Immutable flash-loan vault template
;; No upgrades. Verified by contract-hash.

(define-constant FEE u9) ;; 0.09% (9 basis points)
(define-constant ERR-REPAY (err u300))
(define-constant TEMPLATE-SOURCE 'SP2GTM2ZVYXQKNYMT3MNJY49RQ2MW8Q1DGXZF8519.hashlock-isolated-sbtc-v1)

;; ==========================================
;; TRAITS
;; ==========================================
(define-trait flash-loan-receiver
  (
    (execute (uint) (response bool uint))
  )
)

;; ==========================================
;; DATA VARIABLES
;; ==========================================
(define-data-var total-reserve uint u0)

;; ==========================================
;; CORE LOGIC
;; ==========================================

;; @desc Deposit sBTC into the vault (called by core contract)
(define-public (deposit (amount uint))
  (let ((caller tx-sender))
    ;; Using local shorthand linked via Clarinet.toml
    (try! (contract-call? .sbtc-token transfer amount caller (as-contract tx-sender) none))
    (var-set total-reserve (+ (var-get total-reserve) amount))
    (ok true)
  )
)

;; @desc Flash loan execution engine
;; @param receiver: The borrower's contract
;; @param amount: Amount of sBTC to borrow
(define-public (flash-loan (receiver <flash-loan-receiver>) (amount uint))
  (let (
    (fee-amount (/ (* amount FEE) u10000))
    (pre-balance (var-get total-reserve))
    (borrower tx-sender)
  )
    ;; 1. Transfer sBTC to borrower
    (try! (as-contract (contract-call? .sbtc-token transfer amount tx-sender borrower none)))
    
    ;; 2. Execute borrower callback
    (try! (contract-call? receiver execute amount))

    ;; 3. Verify repayment (Fixed: Changed unwrap-panic to unwrap!)
    (let ((post-balance (unwrap! (contract-call? .sbtc-token get-balance (as-contract tx-sender)) ERR-REPAY)))
      (asserts! (>= post-balance (+ pre-balance fee-amount)) ERR-REPAY)
      
      ;; 4. Update internal reserve
      (var-set total-reserve post-balance)
      (ok true)
    )
  )
)

;; ==========================================
;; READ-ONLY FUNCTIONS
;; ==========================================

(define-read-only (get-template-source)
  (ok TEMPLATE-SOURCE)
)

(define-read-only (get-reserve)
  (var-get total-reserve)
)