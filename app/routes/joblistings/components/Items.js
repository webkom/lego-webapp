import React from 'react';
import joinValues from 'app/utils/joinValues';

const sameYear = joblisting => joblisting.fromYear === joblisting.toYear;

export const Year = joblisting =>
  <div>
    {sameYear(joblisting)
      ? `${joblisting.fromYear}.`
      : `${joblisting.fromYear}. - ${joblisting.toYear}.`}{' '}
    klasse
  </div>;

export const Workplaces = ({ places }) =>
  <div>
    {joinValues(places.map(place => place.town))}
  </div>;

export const Jobtype = status => {
  const jobtype = {
    full_time: 'Fulltid',
    part_time: 'Deltid',
    summer_job: 'Sommerjobb',
    other: 'Annet'
  };
  return jobtype[status];
};
