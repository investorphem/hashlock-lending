;; ==========================================
;; HASHLOCK SAFE VAULT BASE
;; ==========================================
;; Shared immutable safety traits and global constants.
;; All HashLock templates must conform to these standards.

(define-constant BASE-TEMPLATE 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.safe-vault-base)

;; ==========================================
;; PROTOCOL TRAITS
;; ==========================================

(define-trait vault-trait
  (
    (get-template-source () (response principal uint))
    (deposit (uint) (response bool uint))
  )
)

(define-trait flash-loan-receiver-trait
  (
    (execute (uint) (response bool uint))
  )
)

;; ==========================================
;; BASE FUNCTIONS
;; ==========================================

;; @desc Returns the static base template source for verification
(define-read-only (get-template-source)
  (ok BASE-TEMPLATE)
)