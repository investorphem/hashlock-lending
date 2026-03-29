;; ==========================================
;; HASHLOCK SAFE VAULT BASE
;; ==========================================
;; Shared immutable safety traits and global constants.
;; All HashLock templates must conform to these standards.

;; ==========================================
;; GLOBAL CONSTANTS & ERRORS
;; ==========================================
;; Standardized error codes for the entire protocol
(define-constant ERR-NOT-WHITELISTED (err u100))
(define-constant ERR-HASH-MISMATCH (err u101))
(define-constant ERR-ZERO-AMOUNT (err u102))
(define-constant ERR-UNAUTHORIZED (err u401))
(define-constant ERR-REPAY (err u300))

;; SECURITY FIX: Hardcode the exact deployed principal
(define-constant BASE-TEMPLATE 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.safe-vault-base)

;; ==========================================
;; PROTOCOL TRAITS
;; ==========================================

;; @desc The core interface every HashLock vault must implement.
;; The core contract uses this trait to verify and interact with vaults.
(define-trait vault-trait
  (
    ;; Must return the exact whitelisted template principal for contract-hash? verification
    (get-template-source () (response principal uint))
    
    ;; Must allow the core protocol to route deposits
    (deposit (uint) (response bool uint))
  )
)

;; @desc The interface for any external contract attempting a flash loan.
(define-trait flash-loan-receiver-trait
  (
    ;; The callback function where the borrower executes their custom logic
    (execute (uint) (response bool uint))
  )
)

;; ==========================================
;; BASE FUNCTIONS
;; ==========================================

;; @desc Returns the static base template source for verification
(define-public (get-template-source)
  (ok BASE-TEMPLATE)
)
