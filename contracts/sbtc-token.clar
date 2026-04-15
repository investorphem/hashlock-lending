;; sBTC Mock for local validation
;; Standard SIP-010 signature with explicit error types and state tracking

(define-data-var mock-total-transfers uint u0)

(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
    (if (is-eq amount u0)
        (err u0) ;; Explicitly defines the error type as 'uint'
        (begin
            ;; Increment state to justify 'define-public' and clear warnings
            (var-set mock-total-transfers (+ (var-get mock-total-transfers) u1))
            (print { amount: amount, sender: sender, recipient: recipient, memo: memo })
            (ok true)
        )
    )
)

(define-read-only (get-balance (user principal))
    (begin
        ;; Accessing the parameter to clear unused variable warnings
        (print user)
        (ok u0)
    )
)