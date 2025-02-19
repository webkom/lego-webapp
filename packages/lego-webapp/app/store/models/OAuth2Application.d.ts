import type { EntityId } from '@reduxjs/toolkit';
import type { PublicUser } from 'app/store/models/User';

export default interface OAuth2Application {
  id: EntityId;
  name: string;
  description: string;
  redirectUris: string[];
  clientId: string;
  clientSecret: string;
  user: PublicUser;
}
