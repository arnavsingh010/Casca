# System Architecture & OOPS Guidelines

Campus Management Platform — Object-Oriented Programming & Software Engineering Architecture Guide.

---

## 1. Architectural Layers

The system follows a strict **4-layer Clean Architecture**:

```
[ Mobile Client (React Native / Expo) ]
                   │
                   ▼  HTTPS / REST API
          [ Controllers / API ]
                   │
                   ▼  Method Calls
              [ Services ]
          (AuthService, PermissionService, EventService, CalendarService, RegistryService)
                   │
        ┌──────────┴──────────┐
        ▼                     ▼
[ Domain Classes ]    [ Repositories ]
(User, Student,        (Database abstraction)
 Event hierarchy,             │
 RoleAssignment)              ▼
                    [ PostgreSQL (Aiven) ]
```

1. **Client Layer (`client/`)**: Mobile app built with React Native and Expo. Pure view layer; contains zero business logic, performs zero direct database queries, and renders events based on API responses.
2. **Controller Layer (`backend/src/controllers/`)**: Handles HTTP requests, extracts parameters, validates transport schemas, delegates to services, and returns HTTP responses.
3. **Service Layer (`backend/src/services/`)**: Orchestrates business logic, runs authorization checks through `PermissionService`, and coordinates repositories and domain models.
4. **Domain Layer (`backend/src/domain/`)**: Pure object-oriented models encapsulating business invariants, polymorphism (`isVisibleTo`), and domain logic.
5. **Repository Layer (`backend/src/repositories/`)**: Interfaces and SQL/Postgres implementations abstracting database queries from business services.

---

## 2. Core OOP Principles Applied

| OOP Principle         | Implementation in Project                                                                                                                                                                                                         |
| :-------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Inheritance**       | `User` (abstract) ➔ `Student`, `Admin`<br>`Event` (abstract) ➔ `CampusEvent`, `ClubEvent`, `SectionEvent`                                                                                                                         |
| **Polymorphism**      | `Event.isVisibleTo(student)` and `Event.canBeCreatedBy(user)` are abstract methods implemented independently by each event subclass. `CalendarService` simply iterates over polymorphic `Event` collections without type casting. |
| **Encapsulation**     | Private attributes, constructor-enforced invariants (immutable `enrollmentNo`), and accessor methods.                                                                                                                             |
| **Abstraction**       | Repositories conceal PostgreSQL SQL queries; services present simple business interfaces.                                                                                                                                         |
| **Association Class** | `RoleAssignment` bridges `Student` and `Position` while storing temporal and scope attributes (`clubId`, `sectionId`, `assignedBy`, `assignedOn`, `endsOn`).                                                                      |
| **Factory Pattern**   | `EventFactory` encapsulates subclass instantiation based on event scope (`CAMPUS`, `CLUB`, `SECTION`).                                                                                                                            |

---

## 3. Permission & Authorization Model

> [!IMPORTANT]
> A student's rights are **never stored directly on the Student record**. Permissions are dynamically evaluated by `PermissionService` based on active `RoleAssignment` records.

### Permission Evaluation Flow

1. Client requests an action (e.g. `createEvent(CLUB, clubId)`).
2. Controller passes the authenticated user and payload to `EventService`.
3. `EventService` calls `PermissionService.canPublish(actor, ScopeType.CLUB, clubId)`.
4. `PermissionService` queries active role assignments for `actor`, checks whether any assigned `Position` grants `CREATE_CLUB_EVENT` for `clubId`.
5. If allowed, action proceeds; otherwise, an authorization error is thrown and logged.

---

## 4. Database & Infrastructure

- **Database**: PostgreSQL hosted on **Aiven** (managed cloud instance).
- **Security**: TLS-encrypted connections (`sslmode=require`). Credentials stored in `.env`, never in version control.
- **Time Representation**: All timestamps are stored in **UTC** (`timestamptz`). The client converts timestamps to **IST** for student display.
