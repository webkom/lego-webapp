import type { Dateish } from 'app/models';
import type User from 'app/store/models/User';
import type { ID } from 'app/store/models/index';

export default interface Comment {
  id: ID;
  text: string;
  author: User;
  createdAt: Dateish;
  updatedAt: Dateish;
  parent: ID | null;
}
