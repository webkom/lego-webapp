import type { ListLendableObject } from './LendableObject';
import type { PublicUser } from 'app/store/models/User';
import type moment from 'moment-timezone';

export enum LendingRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  DENIED = 'DENIED',
}

export function statusToString(status: LendingRequestStatus): string {
  switch (status) {
    case LendingRequestStatus.PENDING:
      return 'Venter';
    case LendingRequestStatus.APPROVED:
      return 'Godkjent';
    case LendingRequestStatus.DENIED:
      return 'Avslått';
  }
}

export type LendingRequest = {
  id: number;
  author: PublicUser;
  startDate: moment.Moment;
  endDate: moment.Moment;
  message: string;
  status: LendingRequestStatus;
  lendableObject: ListLendableObject;
};
