;; HashLock Lending Core
;; Trustless lending with template verification using Clarity 4

(define-constant ERR-NOT-WHITELISTED (err u100))
(define-constant ERR-HASH-MISMATCH (err u101))
(define-constant ERR-UNAUTHORIZED (err u102))
(define-constant ERR-INSUFFICIENT-BALANCE (err u103))
(define-constant ERR-INVALID-AMOUNT (err u104))

;; Whitelisted template hashes (map of template principal to metadata)
(define-map approved-templates
  principal
  { name: (string-ascii 32), risk-rating: uint, audited-by: (string-ascii 64) }
)

;; User balances (principal -> asset -> balance)
(define-map user-balances
  { user: principal, asset: principal }
  uint
)

;; Total supplied per asset
(define-map total-supply
  principal
  uint
)

;; Insert initial templates (in real deploy, make this governance-controlled)
(define-private (init-templates)
  (map-set approved-templates 'SP1PQHQKV0RJXZFY1DGX8M337W7J0M1Z0N5V7HP.template-isolated-v1
    { name: "IsolatedFlashVault-v1", risk-rating: u10, audited-by: "Trail of Bits + Least Authority" })
  (map-set approved-templates 'SP1PQHQKV0RJXZFY1DGX8M337W7J0M1Z0N5V7HP.template-ststx-sbtc-v1
    { name: "stSTX-sBTC BorrowVault-v1", risk-rating: u20, audited-by: "Trail of Bits" })
)

;; Check if template is approved
(define-read-only (is-template-approved (template principal))
  (is-some (map-get? approved-templates template))
)

;; Verify vault matches template and deposit
(define-public (supply-to-vault (vault principal) (asset principal) (amount uint))
  (let ((template (try! (contract-call? vault get-template-source))))
    (asserts! (is-template-approved template) ERR-NOT-WHITELISTED)
    (asserts! (is-eq (unwrap! (contract-hash? vault) ERR-HASH-MISMATCH)
                      (unwrap! (contract-hash? template) ERR-HASH-MISMATCH))
              ERR-HASH-MISMATCH)
    ;; Transfer asset to vault with post-conditions
    (try! (as-contract (contract-call? asset transfer amount tx-sender vault none)))
    ;; Update balances
    (map-set user-balances { user: tx-sender, asset: asset }
      (+ (default-to u0 (map-get? user-balances { user: tx-sender, asset: asset })) amount))
    (map-set total-supply asset
      (+ (default-to u0 (map-get? total-supply asset)) amount))
    (ok true)
  )
)

;; Withdraw from vault (simplified, add interest accrual later)
(define-public (withdraw-from-vault (vault principal) (asset principal) (amount uint))
  (let ((balance (default-to u0 (map-get? user-balances { user: tx-sender, asset: asset }))))
    (asserts! (>= balance amount) ERR-INSUFFICIENT-BALANCE)
    ;; Call vault to withdraw
    (try! (contract-call? vault withdraw amount tx-sender))
    ;; Update balances
    (map-set user-balances { user: tx-sender, asset: asset } (- balance amount))
    (map-set total-supply asset (- (default-to u0 (map-get? total-supply asset)) amount))
    (ok true)
  )
)

;; Get user balance
(define-read-only (get-user-balance (user principal) (asset principal))
  (default-to u0 (map-get? user-balances { user: user, asset: asset }))
)

;; Get total supply
(define-read-only (get-total-supply (asset principal))
  (default-to u0 (map-get? total-supply asset))
)

;; Initialize on deploy
(begin
  (init-templates)
)
