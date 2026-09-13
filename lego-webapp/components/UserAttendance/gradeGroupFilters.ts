import { GroupType } from 'app/models';
import type { SearchGroupKeyword } from '~/components/Search/searchGroupTags';

export const gradeGroupFilters = [
  {
    id: 'grade-1',
    name: '1. Klasse',
    type: GroupType.Grade,
    groupIds: [16, 22],
  },
  {
    id: 'grade-2',
    name: '2. Klasse',
    type: GroupType.Grade,
    groupIds: [17, 23],
  },
  {
    id: 'grade-3',
    name: '3. Klasse',
    type: GroupType.Grade,
    groupIds: [18, 24],
  },
  {
    id: 'grade-4',
    name: '4. Klasse',
    type: GroupType.Grade,
    groupIds: [19, 25],
  },
  {
    id: 'grade-5',
    name: '5. Klasse',
    type: GroupType.Grade,
    groupIds: [20, 26],
  },
] satisfies SearchGroupKeyword[];
