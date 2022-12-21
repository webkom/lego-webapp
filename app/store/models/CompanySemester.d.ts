import type { ID, Semester } from 'app/store/models/index';

export default interface CompanySemester {
  id: ID;
  semester: Semester;
  year: number;
  activeInterestForm?: boolean;
}
