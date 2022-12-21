import type { PublicUser } from 'app/store/models/User';
import type { ID } from 'app/store/models/index';

export default interface OAuth2Application {
  id: ID;
  name: string;
  description: string;
  redirectUris: string[];
  clientId: string;
  clientSecret: string;
  user: PublicUser;
}
