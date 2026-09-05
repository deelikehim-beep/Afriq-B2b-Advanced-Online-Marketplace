---
name: Better Auth schema requirements
description: Non-obvious Drizzle fields required by the installed Better Auth release.
---

The installed Better Auth Drizzle adapter validates the supplied schema at runtime, not just at TypeScript build time; its account table requires an optional `issuer` field even for email/password authentication.

**Why:** A missing adapter field produced a runtime 500 on account creation while health checks and typechecks still passed.

**How to apply:** When upgrading Better Auth or changing auth tables, run a real sign-up request after schema push and regenerate/compare the adapter schema rather than relying only on compilation.