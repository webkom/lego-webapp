// @flow

import type { Joblisting, Workplace } from 'app/models';
import joinValues from 'app/utils/joinValues';

type YearProps = {
  joblisting: Joblisting,
};

export const Year = ({ joblisting }: YearProps) => (
  <span>
    {joblisting.fromYear === joblisting.toYear
      ? `${joblisting.fromYear}. `
      : `${joblisting.fromYear}. - ${joblisting.toYear}. `}
    klasse
  </span>
);

type WorkplacesProps = {
  places: Array<Workplace>,
};

export const Workplaces = ({ places }: WorkplacesProps) => (
  <span>{joinValues(places.map((place) => place.town))}</span>
);

const types = {
  full_time: 'Fulltid',
  part_time: 'Deltid',
  summer_job: 'Sommerjobb',
  master_thesis: 'Masteroppgave',
  other: 'Annet',
};

type JobType = $Keys<typeof types>;

export const jobType = (status: JobType) => {
  return types[status];
};
