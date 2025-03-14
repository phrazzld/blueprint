# Software Engineering Best Practices for Claude

Use this document as explicit guidelines for maintaining consistently robust, readable, and secure software. Reference regularly when committing code, writing tests, or designing features.

## Commits
- **Conventional Commits**: Strictly follow conventional commit formats:
  - `feat:` New feature
  - `fix:` Bug fix
  - `docs:` Documentation updates
  - `refactor:` Refactoring without functional changes
  - `test:` Adding or modifying tests
  - `chore:` Maintenance or tooling changes
- **Atomic Commits**: Every commit must encapsulate exactly one logical, clearly defined change.

## Logging & Observability
- Implement structured logging in JSON format consistently across environments.
- Always include useful context in logs (timestamps, user IDs, error types).
- Incorporate correlation IDs for tracing requests through distributed systems.
- Instrument clear metrics for monitoring user and system performance.

## Testing
- Maintain high test coverage:
  - Unit tests: Test individual functions/methods thoroughly.
  - Integration tests: Verify interactions between components/services.
  - End-to-End (E2E) tests: Validate full system workflows from user perspective.
- Adopt Test-Driven Development (TDD) strictly unless explicitly stated otherwise.
- Ensure tests are fast, repeatable, and deterministic.
- Confirm all tests pass before commits and merges.

## Documentation
- Explicitly document critical architecture and design decisions within the codebase (markdown).
- Clearly document API endpoints using OpenAPI/Swagger.
- Include concise, practical setup instructions for local development.
- Keep documentation current; update immediately following code changes.

## Architecture & Design
- Clearly separate infrastructure, business logic, and interface layers (Hexagonal Architecture).
- Always define explicit API contracts.
- Implement modular, loosely coupled components that are easy to maintain.
- Handle all errors explicitly, providing clear and actionable error messages.
- Design resilient systems: use retries, graceful degradation, and circuit breakers when appropriate.

## Iterative Development
- Commit small, incremental, deployable changes frequently.
- Ensure each incremental change is fully tested and stable before progressing.
- Prioritize quick feedback and incremental validation of assumptions.

## Automation & CI/CD
- Ensure build, test, deployment, and database migration processes are fully automated and reproducible.
- Maintain robust CI/CD pipelines—never commit code that breaks these pipelines.
- Standardize and containerize development environments (Docker).
- Explicitly manage infrastructure through Infrastructure-as-Code (IaC).

## Security Practices
- Always assume inputs are untrusted; rigorously validate and sanitize.
- Regularly update dependencies and explicitly address vulnerabilities identified by security scans.
- Adhere strictly to least-privilege access principles.
- Encrypt sensitive data both in transit (HTTPS/TLS) and at rest.

## Performance & Scalability
- Regularly verify performance benchmarks and optimize where necessary.
- Monitor and explicitly log performance metrics.
- Design for resilience, implement retries, rate limiting, caching, and avoid single points of failure.
- Include stress and load testing regularly in the development cycle.

## Handling Technical Debt
- Identify and explicitly tag technical debt in comments (`// TECH DEBT:`).
- Prioritize reducing technical debt incrementally alongside feature development.

---

Always strictly adhere to this reference guide to ensure code consistency, maintainability, and quality. Explicitly reference this document when making decisions about implementation details, testing strategies, logging, or architecture. If uncertainty arises, request clarification rather than assuming or deviating from these standards.
