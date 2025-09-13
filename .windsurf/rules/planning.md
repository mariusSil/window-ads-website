---
trigger: model_decision
description: when asked to plan or update the plan
---

# Agent Planning & Code Update Rules
These rules define how the agent will plan and execute changes in this repository. They apply to all tasks unless explicitly overridden.
## Behavior Contract
- Always produce a concrete, step-by-step execution plan before changing code.
- Always include file-by-file change details with exact locations and proposed code edits.
- Always explain the business impact for the requested feature or change.
- If task context is insufficient or ambiguous, ask focused clarifying questions first. Provide safe default assumptions and note any blockers.
- Prefer small, reversible changes. Avoid destructive actions without explicit confirmation.
## Required Output Structure for Every Task
1. Execution Plan
   - High-level steps to completion in order.
   - Milestones and expected outputs for each step.
2. File-by-File Change Plan
   For each file to be touched, specify:
   - Why: rationale and linkage to requirement.
   - Location: path + function/class/line range (e.g., `packages/module/file.ts` in `doWork()` before return).
   - Edits: precise description of changes.
   - Code: minimal snippet or diff proposal (final edits will be applied via patch tools).
   - Config/Migrations: schema, env, or config changes and rollout considerations.
3. Business Impact
   - Value: what outcome users/business get.
   - Success metrics: measurable acceptance (e.g., latency < 200ms, error rate < 0.1%).
   - Risk/Blast radius: components affected, backward-compatibility.
   - Operational impact: runbooks, dashboards, alerts, on-call.
4. Open Questions & Assumptions
   - List missing info, proposed assumptions, and what is blocked by answers.
5. Rollout Plan
   - Dev → Staging → Prod steps, flags, migration order, rollback strategy.
6. Acceptance Criteria Checklist
   - Bullet list the criteria that must be true to consider the task done.
## Code Update Protocol
- Use patch-based changes with 3+ lines of unique context around edits; keep imports at file top.
- Keep functions pure where reasonable; add clear logs at boundaries (I/O, retries, failures).
- Respect existing styles and lint rules; do not introduce unused deps.
- Add comments only where intent is non-obvious; keep code self-explanatory.
- Add migration scripts/config updates atomically with code that uses them.
## Clarifying Questions Checklist (ask when context is insufficient)
- Requirements & scope: exact feature behavior, in/out of scope, acceptance criteria.
- Domain rules: edge cases, constraints, rounding/precision, timezones/locales.
- Interfaces & contracts: APIs, events, schemas, backward compatibility needs.
- Data models: entities/relations, migrations, seed data.
- Performance: SLAs/limits, expected scale, hot paths.
- Security & compliance: authN/Z, PII/PCI/GDPR, secrets handling.
- Observability: logs, metrics, traces, dashboards, alerts.
- Deployment & rollout: order, canary, rollback.
- Ownership & stakeholders: reviewers, approvers, docs update locations.
## Templates
### Task Plan Template
- Execution Plan:
  1) Step 1 …
  2) Step 2 …
- File-by-File Changes:
  - `path/to/file.ext`
    - Why: …
    - Location: `FunctionName()` before/after …
    - Edits: …
    - Code (proposed):
      ```lang
      // minimal snippet showing new/changed lines
      ```
    - Config/Migrations: …
- Business Impact:
  - Value: …
  - Success metrics: …
  - Risk/Blast radius: …
  - Operational impact: …
- Open Questions & Assumptions:
  - Q1: … / Assumption: …
- Rollout Plan:
  - Flags, migration order, rollback …
- Acceptance Criteria:
  - [ ] Criterion A …
  - [ ] Criterion B …
### Change Item Template
- File: `path/to/file.ext`
- Location: `Class.method()` around return
- Edit: Add null-check to prevent NPE
- Code (proposed):
  ```ts
  if (!input) {
    throw new Error(‘input required’);
  }
  ```
## Notes
- When information is missing, present two to three viable options with pros/cons and your recommended choice.
- Always include a brief summary of what changed and why at the