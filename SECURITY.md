# Security policy

## Secrets

Never commit `.env` files, credentials, tokens, connection strings, or private keys. Copy the supplied `.env.example` locally and set values through your deployment platform's secret store.

A tracked environment file was removed in the security-hardening pull request. Treat every value previously stored there as exposed: revoke or rotate it before deploying, including database passwords, API tokens, OAuth secrets, and application signing keys.

## Reporting vulnerabilities

Please report suspected vulnerabilities privately to the repository owner. Do not include exploitable details in public issues.
