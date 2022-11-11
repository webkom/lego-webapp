import type { Dateish } from 'app/models';
import type Group from 'app/store/models/Group';
import type Meeting from 'app/store/models/Meeting';
import type User from 'app/store/models/User';

export default interface Announcement {
  id: number;
  message: string;
  fromGroup: null | Group;
  sent: null | Dateish;
  users: User[];
  groups: Group[];
  events: Event[];
  meetings: Meeting[];
}
