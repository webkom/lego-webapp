import type { ListLendableObject } from './LendableObject';
import type { PublicUser } from 'app/store/models/User';
import type moment from 'moment-timezone';

export enum LendingRequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  DENIED = 'denied',
}

export type LendingRequest = {
  id: number;
  author: PublicUser;
  startDate: moment.Moment;
  endDate: moment.Moment;
  message: string;
  status: LendingRequestStatus;
  pending: boolean;
  lendableObject: ListLendableObject;
};
