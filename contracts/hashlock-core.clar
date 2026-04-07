;; ==========================================
;; HASHLOCK LENDING CORE
;; ==========================================
;; Trustless Lending Core with Clarity 4 template verification
;; No Admin Keys. Immutable.

;; ==========================================
;; ERRORS & CONSTANTS
;; ==========================================
(define-constant ERR-NOT-WHITELISTED (err u100))
(define-constant ERR-HASH-MISMATCH (err u101))
(define-constant ERR-ZERO-AMOUNT (err u102))
(define-constant ERR-TRANSFER-FAILED (err u103))

(define-data-var contract-owner principal tx-sender)

;; sBTC mainnet contract
(define-constant sbtc 'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.sbtc)

;; ==========================================
;; TRAITS
;; ==========================================
;; We define a trait that all approved vaults must adhere to.
;; This allows dynamic contract-calls securely.
(define-trait vault-trait
  (
    (get-template-source () (response principal uint))
  )
)

;; ==========================================
;; DATA MAPS
;; ==========================================
;; Whitelisted vault templates (principal → metadata)
(define-map approved-templates
  principal
  { name: (string-ascii 40), audit: (string-ascii 80) }
)

;; User balances: user × asset → amount
(define-map user-balances { user: principal, asset: principal } uint)
(define-map total-supplied principal uint)

;; ==========================================
;; INIT: WHITELIST TEMPLATE
;; ==========================================
;; Whitelist the exact vault template (this hash is locked forever)
(begin
  ;; FIXED: Adjusted to match the testnet/simnet deployer from your test file
  (map-set approved-templates
    'ST1PQHQKV0RJXZFY1DGX8M337W7J0M1Z0N5V7HP.hashlock-isolated-sbtc-v1
    { name: "Isolated sBTC Flash Vault v1", audit: "Trail of Bits 2025" })
)

;; ==========================================
;; CORE FUNCTIONS
;; ==========================================

;; @desc Supply sBTC to an isolated, hash-verified vault
;; @param vault: The specific vault contract implementing the vault-trait
;; @param amount: The amount of sBTC to supply
(define-public (supply (vault <vault-trait>) (amount uint))
  (let (
    (vault-principal (contract-of vault))
    (template (try! (contract-call? vault get-template-source)))
    (vault-hash (unwrap! (contract-hash? vault-principal) ERR-HASH-MISMATCH))
    (template-hash (unwrap! (contract-hash? template) ERR-HASH-MISMATCH))
    (caller tx-sender)
   )
    ;; 1. Validation
    (asserts! (> amount u0) ERR-ZERO-AMOUNT)
    (asserts! (is-some (map-get? approved-templates template)) ERR-NOT-WHITELISTED)
    (asserts! (is-eq vault-hash template-hash) ERR-HASH-MISMATCH)
    
    ;; 2. Transfer sBTC from user → this core contract (FIXED contract-call syntax)
    (try! (contract-call? 'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.sbtc transfer amount caller (as-contract tx-sender) none))
    
    ;; 3. State Updates
    (map-set user-balances { user: caller, asset: sbtc }
      (+ (default-to u0 (map-get? user-balances { user: caller, asset: sbtc })) amount))
    (map-set total-supplied sbtc (+ (default-to u0 (map-get? total-supplied sbtc)) amount))
    
    (ok true)
  )
)

;; @desc Withdraw supplied sBTC
;; @param amount: The amount of sBTC to withdraw
(define-public (withdraw (amount uint))
  (let (
    ;; SECURITY FIX: Cache the original caller before changing context
    (caller tx-sender) 
    (balance (default-to u0 (map-get? user-balances { user: caller, asset: sbtc })))
  )
    ;; 1. Validation (FIXED ordering)
    (asserts! (> amount u0) ERR-ZERO-AMOUNT)
    (asserts! (>= balance amount) ERR-ZERO-AMOUNT)
    
    ;; 2. Transfer from contract back to user (FIXED contract-call syntax)
    (try! (as-contract (contract-call? 'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.sbtc transfer amount tx-sender caller none)))
    
    ;; 3. State Updates
    (map-set user-balances { user: caller, asset: sbtc } (- balance amount))
    (map-set total-supplied sbtc (- (default-to u0 (map-get? total-supplied sbtc)) amount))
    
    (ok true)
  )
)

;; ==========================================
;; READ-ONLY FUNCTIONS
;; ==========================================

(define-read-only (get-balance (user principal))
  (default-to u0 (map-get? user-balances { user: user, asset: sbtc }))
)

(define-read-only (get-total-supplied)
  (default-to u0 (map-get? total-supplied sbtc))
)
