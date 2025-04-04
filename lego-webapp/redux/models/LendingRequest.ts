import { ListLendableObject } from '~/redux/models/LendableObject';
import type { EntityId } from '@reduxjs/toolkit';
import type { ActionGrant, Dateish } from 'app/models';

export enum LendingRequestStatus {
  Unapproved = 'unapproved',
  ChangesRequested = 'changes_requested',
  Approved = 'approved',
  Denied = 'denied',
  Cancelled = 'cancelled',
}

interface LendingRequest {
  id: EntityId;
  createdBy: EntityId;
  updatedBy: EntityId;
  lendableObject: EntityId;
  status: LendingRequestStatus;
  startDate: Dateish;
  endDate: Dateish;
  text: string;
  actionGrant: ActionGrant;
}

export type ListLendingRequest = Pick<
  LendingRequest,
  | 'id'
  | 'createdBy'
  | 'lendableObject'
  | 'status'
  | 'startDate'
  | 'endDate'
  | 'actionGrant'
>;

export type DetailLendingRequest = Pick<
  LendingRequest,
  | 'id'
  | 'createdBy'
  | 'updatedBy'
  | 'lendableObject'
  | 'status'
  | 'startDate'
  | 'endDate'
  | 'text'
  | 'actionGrant'
>;

export type AdminLendingRequest = DetailLendingRequest;

export type UnknownLendingRequest = ListLendingRequest | AdminLendingRequest;

export type TransformedLendingRequest = ListLendingRequest & {
  lendableObject: ListLendableObject;
};

export type CreateLendingRequest = Pick<
  LendingRequest,
  'lendableObject' | 'startDate' | 'endDate' | 'text'
>;
export type EditLendingRequest = Required<Pick<LendingRequest, 'id'>> &
  Partial<Pick<LendingRequest, 'status' | 'startDate' | 'endDate'>>;
