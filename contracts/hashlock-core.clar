(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-ZERO-AMOUNT (err u101))
(define-constant ERR-HASH-MISMATCH (err u102))
(define-constant ERR-NOT-WHITELISTED (err u103))

(define-data-var contract-owner principal tx-sender)

(define-map approved-templates principal {name: (string-ascii 50), audit: (string-ascii 80)})
(define-map user-balances {user: principal, asset: principal} uint)
(define-map total-supplied principal uint)

;; Whitelist the exact vault templates
(begin
  (map-set approved-templates 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.hashlock-isolated-sbtc-v1
    {name: "Isolated sBTC Flash Vault v1", audit: "Trail of Bits 2025"})
)

(define-public (supply (vault principal) (amount uint))
  (let ((template (try! (contract-call? vault get-template-source))))
    (asserts! (> amount u0) ERR-ZERO-AMOUNT)
    (asserts! (is-some (map-get? approved-templates template)) ERR-NOT-WHITELISTED)
    (asserts! (is-eq (contract-hash? vault) (contract-hash? template)) ERR-HASH-MISMATCH)
    (try! (contract-call? 'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.sbtc transfer amount tx-sender (as-contract tx-sender) none))
    (map-set user-balances {user: tx-sender, asset: 'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.sbtc}
      (+ (default-to u0 (map-get? user-balances {user: tx-sender, asset: 'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.sbtc})) amount))
    (map-set total-supplied 'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.sbtc
      (+ (default-to u0 (map-get? total-supplied 'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.sbtc)) amount))
    (ok true)))

(define-public (withdraw (amount uint))
  (let ((bal (default-to u0 (map-get? user-balances {user: tx-sender, asset: 'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.sbtc}))))
    (asserts! (>= bal amount) ERR-ZERO-AMOUNT)
    (try! (as-contract (contract-call? 'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.sbtc transfer amount tx-sender tx-sender none)))
    (map-set user-balances {user: tx-sender, asset: 'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.sbtc} (- bal amount))
    (map-set total-supplied 'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.sbtc (- (default-to u0 (map-get? total-supplied 'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.sbtc)) amount))
    (ok true)))

(define-read-only (get-balance (user principal))
  (default-to u0 (map-get? user-balances {user: user, asset: 'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.sbtc})))

(define-read-only (get-total-supplied)
  (default-to u0 (map-get? total-supplied 'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.sbtc)))
