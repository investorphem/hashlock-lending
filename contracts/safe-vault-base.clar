;; Safe-vault-base.clar — Shared safety logic (currently minimal)
(define-public (get-template-source)
  (ok (as-contract tx-sender)))
