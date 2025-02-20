import type { EntityId } from '@reduxjs/toolkit';
import type { Semester } from '~/redux/models/index';

export default interface CompanySemester {
  id: EntityId;
  semester: Semester;
  year: number;
  activeInterestForm?: boolean;
}
