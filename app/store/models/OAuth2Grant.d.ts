import type { Dateish } from 'app/models';
import type { ID } from 'app/store/models/index';

export default interface OAuth2Grant {
  id: ID;
  user: ID;
  token: string;
  application: {
    id: ID;
    name: string;
    description: string;
  };
  expires: Dateish;
  scopes: Record<string, string>; // key: scope, value: description
}
