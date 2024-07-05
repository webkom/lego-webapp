import type { EntityId } from '@reduxjs/toolkit';
import type { Dateish } from 'app/models';
import type { PublicUser } from 'app/store/models/User';

export enum LendingRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  DENIED = 'DENIED',
}

export function statusToString(status: LendingRequestStatus): string {
  switch (status) {
    case LendingRequestStatus.PENDING:
      return 'Venter på svar';
    case LendingRequestStatus.APPROVED:
      return 'Godkjent';
    case LendingRequestStatus.DENIED:
      return 'Avslått';
  }
}

export type LendingRequest = {
  id: number;
  author: PublicUser;
  startDate: Dateish;
  endDate: Dateish;
  message: string;
  status: LendingRequestStatus;
  lendableObject: EntityId;
};
