import { FileTemplateMap } from '../types';

/**
 * Default template for DEVREF.md
 */
const DEVREF_CONTENT = `# Software Engineering Best Practices for Claude

Use this document as explicit guidelines for maintaining consistently robust, readable, and secure software. Reference regularly when committing code, writing tests, or designing features.

## Commits
- **Conventional Commits**: Strictly follow conventional commit formats:
  - \`feat:\` New feature
  - \`fix:\` Bug fix
  - \`docs:\` Documentation updates
  - \`refactor:\` Refactoring without functional changes
  - \`test:\` Adding or modifying tests
  - \`chore:\` Maintenance or tooling changes
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
- Identify and explicitly tag technical debt in comments (\`// TECH DEBT:\`).
- Prioritize reducing technical debt incrementally alongside feature development.

---

Always strictly adhere to this reference guide to ensure code consistency, maintainability, and quality. Explicitly reference this document when making decisions about implementation details, testing strategies, logging, or architecture. If uncertainty arises, request clarification rather than assuming or deviating from these standards.
`;

/**
 * Default template for AESTHETIC.md
 */
const AESTHETIC_CONTENT = `# Aesthetic Guide

## Overview
This document defines the aesthetic principles and design language for this project.

## Design Principles
- 
- 
- 

## Color Palette
- Primary: 
- Secondary: 
- Accent: 
- Background: 
- Text: 

## Typography
- Headings: 
- Body: 
- Code: 

## Components
- 
- 
- 

## Layout
- 
- 
- 

## Animations & Transitions
- 
- 
- 
`;

/**
 * Default template for ARCHITECTURE.md
 */
const ARCHITECTURE_CONTENT = `# Architecture

## Overview
This document outlines the architectural design of the project.

## System Design
- 
- 
- 

## Components
- 
- 
- 

## Data Flow
- 
- 
- 

## Dependencies
- 
- 
- 

## Security Considerations
- 
- 
- 

## Scalability
- 
- 
- 
`;

/**
 * Default template for CHECKLIST.md
 */
const CHECKLIST_CONTENT = `# Project Checklist

## Pre-Launch
- [ ] Code review completed
- [ ] Tests passing
- [ ] Documentation updated
- [ ] Performance benchmarks passing
- [ ] Security review completed
- [ ] Accessibility review completed

## Launch
- [ ] Deployment pipeline configured
- [ ] Monitoring set up
- [ ] Backup strategy in place
- [ ] Rollback procedure documented
- [ ] Support team briefed

## Post-Launch
- [ ] Monitor for issues
- [ ] Collect user feedback
- [ ] Address critical bugs
- [ ] Review performance metrics
- [ ] Plan for improvements
`;

/**
 * Default template for PLAN.md
 */
const PLAN_CONTENT = `# Project Plan

## Objectives
- 
- 
- 

## Timeline
- Phase 1:
- Phase 2:
- Phase 3:

## Milestones
- 
- 
- 

## Resources
- 
- 
- 

## Risks & Mitigations
- 
- 
- 

## Success Metrics
- 
- 
- 
`;

/**
 * Default template for TODO.md
 */
const TODO_CONTENT = `# To-Do Items

## High Priority
- [ ] 
- [ ] 
- [ ] 

## Medium Priority
- [ ] 
- [ ] 
- [ ] 

## Low Priority
- [ ] 
- [ ] 
- [ ] 

## Backlog
- [ ] 
- [ ] 
- [ ] 
`;

/**
 * Default template for README.md
 */
const README_CONTENT = `# Project Name

## Overview
Brief description of the project.

## Features
- 
- 
- 

## Installation
\`\`\`bash
# Installation command
\`\`\`

## Usage
\`\`\`bash
# Usage example
\`\`\`

## Development
\`\`\`bash
# Development setup
\`\`\`

## License
`;

/**
 * Default template for BUG.md
 */
const BUG_CONTENT = `# Bug Tracking

## Active Issues
- [ ] 
- [ ] 
- [ ] 

## Resolved Issues
- [x] 
- [x] 
- [x] 

## Reporting a Bug
1. 
2. 
3. 

## Debugging Tips
- 
- 
- 
`;

/**
 * Map of file templates used for generating project documentation
 */
export const templates: FileTemplateMap = {
  'DEVREF.md': {
    defaultContent: DEVREF_CONTENT,
    description: 'Developer reference guide and best practices',
    promptGenerator: (projectName: string) => `Create a comprehensive DEVREF.md file for a project named "${projectName}".

The document should serve as a comprehensive reference for developers working on this project.

Include these sections:
1. Overview/Introduction
2. Commits (conventional commit format guidelines)
3. Logging & Observability best practices
4. Testing requirements and approaches
5. Documentation requirements
6. Architecture & Design principles
7. Iterative Development practices
8. Automation & CI/CD expectations
9. Security Practices
10. Performance & Scalability considerations
11. Handling Technical Debt

Format everything in proper markdown with headings, lists, and appropriate styling.`
  },
  
  'AESTHETIC.md': {
    defaultContent: AESTHETIC_CONTENT,
    description: 'Design principles and style guide',
    promptGenerator: (projectName: string) => `Create a comprehensive AESTHETIC.md file for a project named "${projectName}".
          
The document should define the project's visual identity, design principles, and style guidelines.

Include these sections:
1. Overview/Introduction
2. Design Principles (3-5 key principles)
3. Color Palette (with suggested hex codes)
4. Typography (font recommendations)
5. Layout Guidelines
6. Components/UI Elements
7. Imagery/Icon Guidelines
8. Voice and Tone

Format everything in proper markdown with headings, lists, and appropriate styling.`
  },
  
  'ARCHITECTURE.md': {
    defaultContent: ARCHITECTURE_CONTENT,
    description: 'System architecture and design',
    promptGenerator: (projectName: string) => `Create a comprehensive ARCHITECTURE.md file for a project named "${projectName}".

The document should outline the system architecture, components, and technical design decisions.

Include these sections:
1. Overview/Introduction
2. System Design & Architecture (high-level approach)
3. Components & Services (describe each major component)
4. Data Flow (how data moves through the system)
5. APIs & Interfaces
6. Security Considerations
7. Scalability & Performance
8. Dependencies & External Systems
9. Deployment Architecture

Format everything in proper markdown with headings, lists, diagrams descriptions, and appropriate styling.`
  },
  
  'CHECKLIST.md': {
    defaultContent: CHECKLIST_CONTENT,
    description: 'Pre/post launch tasks and verification checklist',
    promptGenerator: (projectName: string) => `Create a comprehensive CHECKLIST.md file for a project named "${projectName}".

The document should provide a detailed checklist for project phases and quality assurance.

Include these sections:
1. Introduction/Purpose
2. Pre-Development Checklist
3. Development Checklist (with code quality items)
4. Testing Checklist
5. Security Checklist
6. Pre-Launch Checklist
7. Launch Checklist
8. Post-Launch Checklist
9. Maintenance Checklist

Each item should be formatted as a checkbox list item (- [ ] Task description).
Format everything in proper markdown with headings, lists, and appropriate styling.`
  },
  
  'PLAN.md': {
    defaultContent: PLAN_CONTENT,
    description: 'Project planning document',
    promptGenerator: (projectName: string) => `Create a comprehensive PLAN.md file for a project named "${projectName}".

The document should outline the project plan, roadmap, and strategic approach.

Include these sections:
1. Overview/Project Summary
2. Objectives & Goals
3. Project Scope
4. Timeline & Milestones (with realistic phases)
5. Requirements (functional and non-functional)
6. Resources & Team Structure
7. Risk Assessment & Mitigation Strategies
8. Success Metrics & KPIs
9. Budget Considerations (if applicable)

Format everything in proper markdown with headings, lists, and appropriate styling.`
  },
  
  'TODO.md': {
    defaultContent: TODO_CONTENT,
    description: 'Task tracking and backlog',
    promptGenerator: (projectName: string) => `Create a comprehensive TODO.md file for a project named "${projectName}".

The document should track tasks, improvements, and future work items.

Include these sections:
1. Introduction (brief explanation of how to use this document)
2. High Priority Tasks
3. Medium Priority Tasks
4. Low Priority Tasks
5. Backlog
6. Completed Tasks (initially empty section)

Each task should be formatted as a checkbox list item with a clear, actionable description.
Format everything in proper markdown with headings, lists, and appropriate styling.`
  },
  
  'README.md': {
    defaultContent: README_CONTENT,
    description: 'Project overview and documentation',
    promptGenerator: (projectName: string) => `Create a professional README.md file for a project named "${projectName}".

The document should provide a comprehensive overview of the project and getting started information.

Include these sections:
1. Project Title & Description
2. Features
3. Installation Instructions
4. Usage/Quick Start
5. Configuration
6. API Documentation (if applicable)
7. Contributing Guidelines
8. Testing
9. License Information
10. Contact/Support

Format everything in proper markdown with headings, code blocks for installation commands, lists, and appropriate styling.`
  },
  
  'BUG.md': {
    defaultContent: BUG_CONTENT,
    description: 'Bug tracking and reporting guidelines',
    promptGenerator: (projectName: string) => `Create a comprehensive BUG.md file for a project named "${projectName}".

The document should provide guidelines for bug tracking and reporting.

Include these sections:
1. Introduction/Purpose
2. Bug Report Template (with fields like description, steps to reproduce, expected vs actual behavior, etc.)
3. Current Known Issues (initially with placeholder items)
4. Bug Prioritization Guidelines
5. Bug Resolution Process
6. Testing & Verification Process
7. Reporting Security Vulnerabilities

Format everything in proper markdown with headings, lists, code blocks for examples, and appropriate styling.`
  }
};