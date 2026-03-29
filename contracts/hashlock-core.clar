;; hashlock-core-v2.clar
;; Trustless Lending Core with Template Verification + Governance + Borrow

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; ERROR CODES
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(define-constant ERR-NOT-WHITELISTED (err u100))
(define-constant ERR-HASH-MISMATCH   (err u101))
(define-constant ERR-ZERO-AMOUNT     (err u102))
(define-constant ERR-NOT-OWNER       (err u103))
(define-constant ERR-PAUSED          (err u104))
(define-constant ERR-SUPPLY-CAP      (err u105))
(define-constant ERR-INSUFFICIENT    (err u106))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; STATE
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(define-data-var contract-owner principal tx-sender)
(define-data-var paused bool false)
(define-data-var supply-cap uint u100000000000) ;; configurable max pool size

;; sBTC mainnet contract
(define-constant sbtc 'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.sbtc)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; TEMPLATE WHITELIST
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(define-map approved-templates
  principal
  { name: (string-ascii 40), audit: (string-ascii 80), version: uint }
)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; ACCOUNTING
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(define-map user-balances { user: principal, asset: principal } uint)
(define-map user-borrows  { user: principal, asset: principal } uint)
(define-map total-supplied principal uint)
(define-map total-borrowed principal uint)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; GOVERNANCE FUNCTIONS
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(define-public (set-template (template principal)
                             (name (string-ascii 40))
                             (audit (string-ascii 80))
                             (version uint))
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR-NOT-OWNER)
    (map-set approved-templates template
      { name: name, audit: audit, version: version })
    (ok true)
  )
)

(define-public (remove-template (template principal))
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR-NOT-OWNER)
    (map-delete approved-templates template)
    (ok true)
  )
)

(define-public (set-paused (state bool))
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR-NOT-OWNER)
    (var-set paused state)
    (ok state)
  )
)

(define-public (set-supply-cap (new-cap uint))
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR-NOT-OWNER)
    (var-set supply-cap new-cap)
    (ok new-cap)
  )
)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; SUPPLY
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(define-public (supply (vault principal) (amount uint))
  (let (
    (template (try! (contract-call? vault get-template-source)))
    (vault-hash (unwrap! (contract-hash? vault) ERR-HASH-MISMATCH))
    (template-hash (unwrap! (contract-hash? template) ERR-HASH-MISMATCH))
    (current-total (default-to u0 (map-get? total-supplied sbtc)))
   )
    (asserts! (not (var-get paused)) ERR-PAUSED)
    (asserts! (> amount u0) ERR-ZERO-AMOUNT)
    (asserts! (is-some (map-get? approved-templates template)) ERR-NOT-WHITELISTED)
    (asserts! (is-eq vault-hash template-hash) ERR-HASH-MISMATCH)
    (asserts! (<= (+ current-total amount) (var-get supply-cap)) ERR-SUPPLY-CAP)

    ;; Transfer sBTC from user → protocol
    (try! (contract-call? sbtc transfer amount tx-sender (as-contract tx-sender) none))

    ;; Update accounting
    (map-set user-balances { user: tx-sender, asset: sbtc }
      (+ (default-to u0 (map-get? user-balances { user: tx-sender, asset: sbtc })) amount))

    (map-set total-supplied sbtc (+ current-total amount))

    (print { event: "supply", user: tx-sender, amount: amount })

    (ok true)
  )
)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; WITHDRAW
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(define-public (withdraw (amount uint))
  (let (
    (balance (default-to u0 (map-get? user-balances { user: tx-sender, asset: sbtc })))
    (current-total (default-to u0 (map-get? total-supplied sbtc)))
   )
    (asserts! (not (var-get paused)) ERR-PAUSED)
    (asserts! (> amount u0) ERR-ZERO-AMOUNT)
    (asserts! (>= balance amount) ERR-INSUFFICIENT)

    ;; Transfer sBTC back to user
    (try! (as-contract (contract-call? sbtc transfer amount tx-sender tx-sender none)))

    ;; Update accounting
    (map-set user-balances { user: tx-sender, asset: sbtc } (- balance amount))
    (map-set total-supplied sbtc (- current-total amount))

    (print { event: "withdraw", user: tx-sender, amount: amount })

    (ok true)
  )
)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; BORROW (Simple Isolated Model)
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(define-public (borrow (amount uint))
  (let (
    (available (- (default-to u0 (map-get? total-supplied sbtc))
                  (default-to u0 (map-get? total-borrowed sbtc))))
   )
    (asserts! (not (var-get paused)) ERR-PAUSED)
    (asserts! (> amount u0) ERR-ZERO-AMOUNT)
    (asserts! (>= available amount) ERR-INSUFFICIENT)

    ;; Record borrow
    (map-set user-borrows { user: tx-sender, asset: sbtc }
      (+ (default-to u0 (map-get? user-borrows { user: tx-sender, asset: sbtc })) amount))

    (map-set total-borrowed sbtc
      (+ (default-to u0 (map-get? total-borrowed sbtc)) amount))

    ;; Transfer to borrower
    (try! (as-contract (contract-call? sbtc transfer amount tx-sender tx-sender none)))

    (print { event: "borrow", user: tx-sender, amount: amount })

    (ok true)
  )
)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; READ-ONLY
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(define-read-only (get-balance (user principal))
  (default-to u0 (map-get? user-balances { user: user, asset: sbtc })))

(define-read-only (get-borrow (user principal))
  (default-to u0 (map-get? user-borrows { user: user, asset: sbtc })))

(define-read-only (get-total-supplied)
  (default-to u0 (map-get? total-supplied sbtc)))

(define-read-only (get-total-borrowed)
  (default-to u0 (map-get? total-borrowed sbtc)))

(define-read-only (get-available-liquidity)
  (- (default-to u0 (map-get? total-supplied sbtc))
     (default-to u0 (map-get? total-borrowed sbtc))))
