# DEPLOYMENT CHECKLIST

Always verify and explicitly confirm the following checkpoints are met before committing, merging, or deploying changes.

## ✅ Code Quality & Standards
- [ ] Code adheres strictly to DEVREF.md guidelines.
- [ ] ESLint and Prettier pass without warnings or errors.
- [ ] Jest tests (unit and integration) pass locally and in CI.

## ✅ Commits & Pull Requests
- [ ] Commits follow Conventional Commit standards (`feat:`, `fix:`, `docs:`, etc.).
- [ ] Each commit addresses exactly one logical change.
- [ ] Pull Requests include clear documentation of changes, testing instructions, and motivations.

## ✅ Local Development Environment
- [ ] Application builds and runs locally via Docker (`docker compose up`).
- [ ] Structured JSON logs accessible through Docker (`docker logs`).
- [ ] `.env.example` provided and updated with all necessary variables.

## ✅ API & Integration
- [ ] APIs explicitly documented with OpenAPI/Swagger.
- [ ] API contracts validated and adhered to strictly.
- [ ] External integrations thoroughly tested and verified.

## ✅ Analytics
- [ ] Google Analytics integrated and tracking page views and events correctly.

## ✅ Security
- [ ] Dependencies scanned for vulnerabilities (`npm audit`) with no unresolved critical issues.
- [ ] Environment variables securely managed and no secrets committed to version control.
- [ ] Input validation implemented and tested (using libraries like `express-validator`).

## ✅ Docker & Infrastructure
- [ ] Dockerfile uses standard base image (`node:lts-alpine`) and builds without issues.
- [ ] Docker Compose configurations accurately reflect necessary services.

## ✅ Feature Flags & Configuration
- [ ] Feature flags tested in both enabled and disabled states.
- [ ] Environment variables match documented configuration.

## ✅ Data Management
- [ ] PostgreSQL (or specified database) properly configured, with regular backups.
- [ ] Data restoration processes tested and confirmed working.

---

Claude, explicitly verify each item above before marking a task as complete. Seek immediate clarification if uncertain about any point.
