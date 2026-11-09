import { EventStatus, Permission, ScopeType, UserType } from './index';

/**
 * What a permission question is asked about.
 * CAMPUS has no target; CLUB and SECTION carry the id of the club or section.
 */
export type ScopeTarget =
  | { scopeType: ScopeType.CAMPUS }
  | { scopeType: ScopeType.CLUB; clubId: string }
  | { scopeType: ScopeType.SECTION; sectionId: string };

/** One active role assignment as seen by PermissionService (flattened, no DB types). */
export interface AuthAssignment {
  assignmentId: string;
  positionId: string;
  positionName: string;
  scopeType: ScopeType;
  permissions: Permission[];
  /** Set only when scopeType is CLUB. */
  clubId: string | null;
  /** Set only when scopeType is SECTION. */
  sectionId: string | null;
  /** ISO 8601 UTC; null means open-ended. */
  endsOn: string | null;
}

/**
 * The authenticated caller. Built once per request by requireAuth from the
 * database (never from the token) and passed to PermissionService.
 * Admins are not students: the student-only fields are null for them.
 */
export interface AuthUser {
  userId: string;
  name: string;
  type: UserType;
  enrollmentNo: string | null;
  sectionId: string | null;
  course: string | null;
  year: number | null;
  /** Active assignments only. */
  assignments: AuthAssignment[];
  /** Clubs the user belongs to in any position (for members-only visibility). */
  clubIds: string[];
}

/** The slice of an event that PermissionService needs. Owned jointly with Member B. */
export interface EventRef {
  scope: ScopeType;
  /** Set only for CLUB events. */
  clubId: string | null;
  /** Target sections of a SECTION event; empty otherwise. */
  targetSectionIds: string[];
  createdBy: string;
  status: EventStatus;
}
