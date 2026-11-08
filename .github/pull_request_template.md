## Description

<!-- Provide a brief summary of the changes introduced by this pull request. -->

## Linked Use Cases & Requirements

- **Use Case(s)**: [e.g. UC-03 View calendar, UC-06 Create club event, UC-14 Request campus event approval]
- **Requirement(s)**: [e.g. FR-5, FR-6, FR-13]

## Team Work Split Area

- [ ] **Member A**: Domain and Access Control (User, Student, Club, Position, RoleAssignment, AuthService, PermissionService, RegistryService)
- [ ] **Member B**: Events and Calendar (Event hierarchy, EventFactory, EventService, CalendarService, CalendarFilter, Approval workflow)
- [ ] **Member C**: Interface and Quality (React Native UI screens, forms, tests, demo data, docs)

## OOPS & Software Engineering Checklist

- [ ] **Encapsulation**: Class fields are private; state mutations go through methods with invariant validation.
- [ ] **Polymorphism**: Overridden methods (`isVisibleTo()`, `canBeCreatedBy()`) used instead of `if-else / switch` on types.
- [ ] **Layering**: Clean 4-layer architecture maintained (UI -> Controller -> Service -> Domain -> Repository).
- [ ] **Authorization**: All permission checks delegate to `PermissionService` on the server; no client-side-only security.
- [ ] **Immutability**: Crucial identifiers (such as `enrollmentNo`) are immutable after creation.
- [ ] **Database & Time**: All timestamps handled in UTC (`timestamptz`); database credentials loaded from environment variables (no hardcoded secrets).

## Acceptance Scenario Verification

<!-- Which acceptance scenarios from Section 13 of the Design Document have been verified? -->

- [ ] Tested with relevant roles and verified expected visibility / rejection behavior.

## Checklist

- [ ] Staged lint and formatting passed locally (`npm run lint`, `npm run format:check`).
- [ ] Commit messages follow Conventional Commits (`feat:`, `fix:`, `refactor:`, etc.).
- [ ] No extraneous debug statements (`console.log`) left in production code.
