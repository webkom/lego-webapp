import joinValues from '~/utils/joinValues';
import type { TagColors } from '~/components/Tags/Tag';
import type { ListJoblisting, Workplace } from '~/redux/models/Joblisting';

export const Year = ({ joblisting }: { joblisting: ListJoblisting }) => (
  <span>
    {joblisting.fromYear === joblisting.toYear
      ? `${joblisting.fromYear}. `
      : `${joblisting.fromYear}. - ${joblisting.toYear}. `}
    klasse
  </span>
);

export const Workplaces = ({ places }: { places: Workplace[] }) => (
  <span>{joinValues(places.map((place) => place.town))}</span>
);

const jobTypes = {
  full_time: 'Fulltid',
  part_time: 'Deltid',
  summer_job: 'Sommerjobb',
  master_thesis: 'Masteroppgave',
  other: 'Annet',
};
export type JobType = keyof typeof jobTypes;

export const jobType = (status: JobType) => {
  return jobTypes[status];
};

export const jobTypeColor = (status: JobType): TagColors => {
  switch (status) {
    case 'full_time':
      return 'red';
    case 'part_time':
      return 'blue';
    case 'summer_job':
      return 'orange';
    case 'master_thesis':
      return 'purple';
    case 'other':
      return 'cyan';
    default:
      return 'gray';
  }
};
