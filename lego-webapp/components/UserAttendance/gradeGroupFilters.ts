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

export const studyProgramGroupFilters = [
  {
    id: 'study-data',
    name: 'Data',
    type: 'studieretning',
    groupIds: [15, 16, 17, 18, 19, 20],
    aliases: ['datateknologi'],
  },
  {
    id: 'study-cyber',
    name: 'Cyber',
    type: 'studieretning',
    groupIds: [21, 22, 23, 24, 25, 26],
    aliases: ['komtek', 'cybersikkerhet', 'cybdat', 'kommunikasjonsteknologi'],
  },
] satisfies SearchGroupKeyword[];

export const filterableGroups = gradeGroupFilters.map((group) => ({
  name: group.name,
  ids: group.groupIds,
}));

export const programFilterGroups = [
  {
    name: 'Data',
    ids: [16, 17, 18, 19, 20],
  },
  {
    name: 'Komtek',
    ids: [22, 23, 24, 25, 26],
  },
];
