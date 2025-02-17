import type { EntityId } from '@reduxjs/toolkit';

export default interface EmailUser {
  id: EntityId;
  user: EntityId;
  internalEmail: string;
  internalEmailEnabled: boolean;
}
