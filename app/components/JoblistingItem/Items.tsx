import joinValues from 'app/utils/joinValues';
import type { ListJoblisting, Workplace } from 'app/store/models/Joblisting';

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
