;; hashlock-core.clar — Trustless Lending Core with Clarity 4 template verification
(define-constant ERR-NOT-WHITELISTED (err u100))
(define-constant ERR-HASH-MISMATCH (err u101))
(define-constant ERR-ZERO-AMOUNT (err u102))

(define-data-var contract-owner principal tx-sender)

;; Whitelisted vault templates (principal → metadata)
(define-map approved-templates
  principal
  { name: (string-ascii 40), audit: (string-ascii 80) }
)

;; User balances: user × asset → amount
(define-map user-balances { user: principal, asset: principal } uint)
(define-map total-supplied principal uint)

;; sBTC mainnet contract
(define-constant sbtc 'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.sbtc)

;; Whitelist the exact vault template (this hash is locked forever)
(begin
  ;; CHANGED TO YOUR ADDRESS: SP2GTM2ZVYXQKNYMT3MNJY49RQ2MW8Q1DGXZF8519
  (map-set approved-templates
    'SP2GTM2ZVYXQKNYMT3MNJY49RQ2MW8Q1DGXZF8519.hashlock-isolated-sbtc-v1
    { name: "Isolated sBTC Flash Vault v1", audit: "Trail of Bits 2025" })
)

(define-public (supply (vault principal) (amount uint))
  (let (
    (template (try! (contract-call? vault get-template-source)))
    (vault-hash (unwrap! (contract-hash? vault) ERR-HASH-MISMATCH))
    (template-hash (unwrap! (contract-hash? template) ERR-HASH-MISMATCH))
   )
    (asserts! (> amount u0) ERR-ZERO-AMOUNT)
    (asserts! (is-some (map-get? approved-templates template)) ERR-NOT-WHITELISTED)
    (asserts! (is-eq vault-hash template-hash) ERR-HASH-MISMATCH)
    ;; Transfer sBTC from user → this core contract
    (try! (contract-call? sbtc transfer amount tx-sender (as-contract tx-sender) none))
    ;; Record supply
    (map-set user-balances { user: tx-sender, asset: sbtc }
      (+ (default-to u0 (map-get? user-balances { user: tx-sender, asset: sbtc })) amount))
    (map-set total-supplied sbtc (+ (default-to u0 (map-get? total-supplied sbtc)) amount))
    (ok true)
  )
)

(define-public (withdraw (amount uint))
  (let ((balance (default-to u0 (map-get? user-balances { user: tx-sender, asset: sbtc }))))
    (asserts! (>= balance amount) ERR-ZERO-AMOUNT)
    (try! (as-contract (contract-call? sbtc transfer amount tx-sender tx-sender none)))
    (map-set user-balances { user: tx-sender, asset: sbtc } (- balance amount))
    (map-set total-supplied sbtc (- (default-to u0 (map-get? total-supplied sbtc)) amount))
    (ok true)
  )
)

(define-read-only (get-balance (user principal))
  (default-to u0 (map-get? user-balances { user: user, asset: sbtc })))

(define-read-only (get-total-supplied)
  (default-to u0 (map-get? total-supplied sbtc)))