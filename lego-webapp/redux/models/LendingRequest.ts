import type Comment from './Comment';
import type { EntityId } from '@reduxjs/toolkit';
import type { ActionGrant } from 'app/models';
import type { ContentTarget } from '~/utils/contentTarget';

export enum LendingRequestStatus {
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
  text: string;
  comments: Comment[];
  contentTarget: ContentTarget;
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
  | 'comments'
  | 'contentTarget'
  | 'actionGrant'
>;

export type AdminLendingRequest = DetailLendingRequest;

export type UnknownLendingRequest = ListLendingRequest | AdminLendingRequest;

export type CreateLendingRequest = Pick<
  LendingRequest,
  'lendableObject' | 'startDate' | 'endDate'
>;
export type EditLendingRequest = Required<Pick<LendingRequest, 'id'>> &
  Partial<Pick<LendingRequest, 'status' | 'startDate' | 'endDate'>>;
