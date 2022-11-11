import type { Dateish } from 'app/models';
import type { ID } from 'app/store/models/index';

export default interface Meeting {
  id: number;
  createdBy: ID;
  title: string;
  location: string;
  startTime: Dateish;
  endTime: Dateish;
  reportAuthor: ID | null;
  mazemapPoi: null | number;
}
