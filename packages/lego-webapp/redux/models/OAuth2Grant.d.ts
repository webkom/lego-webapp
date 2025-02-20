import type { EntityId } from '@reduxjs/toolkit';
import type { Dateish } from 'app/models';

export default interface OAuth2Grant {
  id: EntityId;
  user: EntityId;
  token: string;
  application: {
    id: EntityId;
    name: string;
    description: string;
  };
  expires: Dateish;
  scopes: Record<string, string>; // key: scope, value: description
}
