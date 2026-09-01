# CODEPILOT ENGINEERING CONSTITUTION

## Mission
Build maintainable, secure, testable, scalable and human-readable software. Code generation is not the goal by itself; a verified working project is the goal.

## Non-negotiable rules
1. Understand before modifying. Establish a baseline before changing an existing project.
2. Prefer the smallest safe change. Never rewrite a working system without evidence.
3. Never claim a test, build, deployment or feature works unless it was actually verified.
4. Generated AI output is untrusted until validated, linted, tested and built.
5. Never expose API keys, tokens or secrets to the browser or repository.
6. Keep presentation, application logic, provider adapters and project-generation logic separated.
7. Fail gracefully with actionable errors; never leave the user in an unusable state.
8. Preserve user data and provide rollback/recovery for destructive AI changes.
9. Prefer standards, small dependencies and progressive enhancement.
10. Security, privacy, accessibility and performance are requirements, not optional polish.

## AI Provider Architecture
All model providers are accessed through a provider adapter. The UI must not depend on a specific vendor. Providers must support a common contract: `generate`, `validate`, `models` (when available). Provider selection is configuration, not hard-coded business logic.

## Build pipeline
`Specify -> Plan -> Generate -> Validate -> Test -> Build -> Review -> Deploy`

A failed validation or build must stop promotion and surface the logs. Automatic repair must create a reversible change and rerun validation.

## CI/CD
Every generated repository should be able to include GitHub Actions for syntax validation, tests, build checks and deployment. Secrets belong in GitHub/Vercel environment secrets, never in source.

## Web standards
Use semantic HTML5, modern CSS, ES modules, accessible controls, RTL/LTR support, responsive mobile-first layouts and progressive enhancement.

## Quality principles
KISS, DRY, YAGNI, SOLID where useful, separation of concerns, explicit error handling, small modules, readable names, meaningful commits, README, LICENSE, CHANGELOG and `.gitignore`.

## Product principle
CodePilot is an App Builder, not a chat box: `Idea -> Architecture -> Files -> Preview -> Validate -> Repair -> Export -> CI/CD`.
