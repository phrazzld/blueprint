# CLAUDE DIRECTIVES

This document provides essential guidelines for Claude when working in this codebase.

## 📋 Build & Test Commands

```bash
# Project setup (Go)
go mod init github.com/phrazzld/blueprint
go mod tidy

# Build
go build -o bin/blueprint ./cmd/blueprint

# Run tests
go test ./...
go test -v ./path/to/specific/test

# Linting
golangci-lint run
```

## 🧩 Code Style Guidelines

- **Commits**: Follow conventional commits (feat, fix, docs, refactor, test, chore)
- **Architecture**: Hexagonal approach - separate infrastructure, business logic and interfaces
- **Error Handling**: Always handle errors explicitly with clear actionable messages
- **Logging**: Use structured JSON format with timestamps, IDs and context
- **Documentation**: Document all exported functions with godoc
- **Testing**: Maintain high coverage with unit and integration tests
- **Technical Debt**: Tag with `// TECH DEBT:` comments
- **Directory Structure**: Follow Go standards (cmd/, internal/, pkg/)

## 📑 Key Reference Files

Always consult: PLAN.md, DEVREF.md, ARCHITECTURE.md, and CHECKLIST.md before implementing features or making changes.