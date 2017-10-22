// @flow

import React from 'react';
import joinValues from 'app/utils/joinValues';
import type { Workplace, Joblisting } from 'app/models';

type YearProps = {
  joblisting: Joblisting
};

export const Year = ({ joblisting }: YearProps) => (
  <div>
    {joblisting.fromYear === joblisting.toYear
      ? `${joblisting.fromYear}. `
      : `${joblisting.fromYear}. - ${joblisting.toYear}. `}
    klasse
  </div>
);

type WorkplacesProps = {
  places: Array<Workplace>
};

export const Workplaces = ({ places }: WorkplacesProps) => (
  <div>{joinValues(places.map(place => place.town))}</div>
);

const types = {
  full_time: 'Fulltid',
  part_time: 'Deltid',
  summer_job: 'Sommerjobb',
  other: 'Annet'
};

type JobType = $Keys<typeof types>;

export const jobType = (status: JobType) => {
  return types[status];
};
