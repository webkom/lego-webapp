import type { ID } from 'app/store/models/index';
import type { Duration } from 'moment-timezone';

interface LendableObject {
  id: ID;
  title: string;
  description: string;
  image: string;
  lendingCommentPromt: string;
  hasContract: boolean;
  maxLendingPeriod: Duration | string;
}

export type ListLendableObject = Pick<LendableObject, 'id' | 'title' | 'image'>;
export type DetailedLendableObject = ListLendableObject &
  Pick<LendableObject, 'description', 'hasContract'>;
