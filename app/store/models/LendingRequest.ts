import type { ListLendableObject } from './LendableObject';
import type { User } from 'app/models';
import type moment from 'moment-timezone';

export enum LendingRequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  DENIED = 'denied',
}

export type LendingRequest = {
  id: number;
  author: User;
  startDate: moment.Moment;
  endDate: moment.Moment;
  message: string;
  status: LendingRequestStatus;
  pending: boolean;
  lendableObject: ListLendableObject;
};
