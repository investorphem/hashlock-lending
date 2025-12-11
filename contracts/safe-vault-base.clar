;; SafeVaultBase
;; Base for all vaults with restrict-assets? post-conditions

(define-trait asset-trait
  ((transfer (uint principal principal (optional (buff 34))) (response bool uint))))

(define-constant ERR-POST-CONDITION-VIOLATED (err u200))
(define-constant ERR-INVALID-CALL (err u201))

;; Safe external call with asset restrictions
(define-public (safe-external-call (target principal) (asset <asset-trait>) (amount uint) (recipient principal))
  (let ((allowed (list 
                  { asset: (contract-of asset), max: amount }  ;; Only allow exact amount out
                )))
    (try! (restrict-assets? allowed))  ;; Clarity 4: set post-condition
    (try! (contract-call? target some-function amount recipient))  ;; Replace with actual call
    (ok true)
  )
)

;; Example withdraw function (to be overridden)
(define-public (withdraw (amount uint) (recipient principal))
  (err u999)  ;; Placeholder
)

;; Example borrow function
(define-public (borrow (amount uint) (recipient principal))
  (err u999)  ;; Placeholder
)

;; Template source (must return self as pure template)
(define-public (get-template-source)
  (ok (as-contract tx-sender))
)
