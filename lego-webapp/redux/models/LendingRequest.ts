import { ListLendableObject } from '~/redux/models/LendableObject';
import type { EntityId } from '@reduxjs/toolkit';
import type { ActionGrant, Dateish, User } from 'app/models';
import { PublicUser } from '~/redux/models/User';

export enum LendingRequestStatus {
  Created = 'created',
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
  createdAt: Dateish;
  lendableObject: EntityId;
  status: LendingRequestStatus;
  startDate: Dateish;
  endDate: Dateish;
  text: string;
  actionGrant: ActionGrant;
  timelineEntries: TimelineEntry[];
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
  | 'timelineEntries'
>;

export type DetailLendingRequest = Pick<
  LendingRequest,
  | 'id'
  | 'createdBy'
  | 'createdAt'
  | 'updatedBy'
  | 'lendableObject'
  | 'status'
  | 'startDate'
  | 'endDate'
  | 'text'
  | 'actionGrant'
  | 'timelineEntries'
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

export type TimelineEntry = {
  id: EntityId;
  createdBy: PublicUser;
  createdAt: Dateish;
  message: string;
  isSystem: boolean;
  status: LendingRequestStatus;
};
