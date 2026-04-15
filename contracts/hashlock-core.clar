;; ==========================================
;; HASHLOCK LENDING CORE
;; ==========================================
;; Trustless Lending Core for sBTC
;; No Admin Keys. Immutable.

(define-constant ERR-NOT-WHITELISTED (err u100))
(define-constant ERR-HASH-MISMATCH (err u101))
(define-constant ERR-ZERO-AMOUNT (err u102))

;; ==========================================
;; TRAITS
;; ==========================================
(define-trait vault-trait
  (
    (get-template-source () (response principal uint))
  )
)

;; ==========================================
;; DATA MAPS
;; ==========================================
(define-map approved-templates
  principal
  { name: (string-ascii 40), audit: (string-ascii 80) }
)

(define-map user-balances { user: principal, asset: principal } uint)
(define-map total-supplied principal uint)

;; ==========================================
;; INITIALIZATION
;; ==========================================
(begin
  (map-set approved-templates
    'SP2GTM2ZVYXQKNYMT3MNJY49RQ2MW8Q1DGXZF8519.hashlock-isolated-sbtc-v1
    { name: "Isolated sBTC Flash Vault v1", audit: "Trail of Bits 2025" })
)

;; ==========================================
;; CORE FUNCTIONS
;; ==========================================

;; @desc Supply sBTC to the protocol
(define-public (supply (vault <vault-trait>) (amount uint))
  (let (
    (vault-principal (contract-of vault))
    (template (try! (contract-call? vault get-template-source)))
    (caller tx-sender)
   )
    ;; 1. Validation
    (asserts! (> amount u0) ERR-ZERO-AMOUNT)
    (asserts! (is-some (map-get? approved-templates template)) ERR-NOT-WHITELISTED)
    (asserts! (is-eq vault-principal template) ERR-HASH-MISMATCH)
    
    ;; 2. Transfer sBTC from user -> this core contract
    (try! (contract-call? .sbtc-token transfer amount caller (as-contract tx-sender) none))
    
    ;; 3. State Updates
    (map-set user-balances { user: caller, asset: .sbtc-token }
      (+ (default-to u0 (map-get? user-balances { user: caller, asset: .sbtc-token })) amount))
    (map-set total-supplied .sbtc-token (+ (default-to u0 (map-get? total-supplied .sbtc-token)) amount))
    
    (ok true)
  )
)

;; @desc Withdraw supplied sBTC
(define-public (withdraw (amount uint))
  (let (
    (caller tx-sender) 
    (balance (default-to u0 (map-get? user-balances { user: caller, asset: .sbtc-token })))
  )
    ;; 1. Validation
    (asserts! (>= balance amount) ERR-ZERO-AMOUNT)
    (asserts! (> amount u0) ERR-ZERO-AMOUNT)
    
    ;; 2. Transfer from contract back to user
    (try! (as-contract (contract-call? .sbtc-token transfer amount tx-sender caller none)))
    
    ;; 3. State Updates
    (map-set user-balances { user: caller, asset: .sbtc-token } (- balance amount))
    (map-set total-supplied .sbtc-token (- (default-to u0 (map-get? total-supplied .sbtc-token)) amount))
    
    (ok true)
  )
)

;; ==========================================
;; READ-ONLY FUNCTIONS
;; ==========================================

(define-read-only (get-balance (user principal))
  (default-to u0 (map-get? user-balances { user: user, asset: .sbtc-token }))
)

(define-read-only (get-total-supplied)
  (default-to u0 (map-get? total-supplied .sbtc-token))
)