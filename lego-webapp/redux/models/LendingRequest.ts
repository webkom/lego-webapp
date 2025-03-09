import type { EntityId } from '@reduxjs/toolkit';

enum LendingRequestStatus {
  Unapproved = 'unapproved',
  Approved = 'approved',
  Denied = 'denied',
  Cancelled = 'cancelled',
  ChangesRequested = 'changes_requested',
}

interface LendingRequest {
  id: EntityId;
  createdBy: EntityId;
  updatedBy: EntityId;
  lendableObject: EntityId;
  status: LendingRequestStatus;
  startDate: string;
  endDate: string;
}

export type ListLendingRequest = Pick<
  LendingRequest,
  | 'id'
  | 'createdBy'
  | 'updatedBy'
  | 'lendableObject'
  | 'status'
  | 'startDate'
  | 'endDate'
>;

export type AdminLendingRequest = ListLendingRequest;

export type UnknownLendingRequest = ListLendingRequest | AdminLendingRequest;

export type CreateLendingRequest = Pick<
  LendingRequest,
  'lendableObject' | 'startDate' | 'endDate'
>;
export type EditLendingRequest = Partial<
  Pick<LendingRequest, 'id' | 'status' | 'startDate' | 'endDate'>
>;
