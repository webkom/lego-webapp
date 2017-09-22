import React from 'react';
import joinValues from 'app/utils/joinValues';

export const Year = ({ joblisting }) => (
  <div>
    {joblisting.fromYear === joblisting.toYear
      ? `${joblisting.fromYear}.`
      : `${joblisting.fromYear}. - ${joblisting.toYear}.`}{' '}
    klasse
  </div>
);

export const Workplaces = ({ places }) => <div>{joinValues(places.map(place => place.town))}</div>;

export const jobType = status => {
  const types = {
    full_time: 'Fulltid',
    part_time: 'Deltid',
    summer_job: 'Sommerjobb',
    other: 'Annet'
  };
  return types[status];
};
