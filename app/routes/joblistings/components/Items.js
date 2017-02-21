import React from 'react';

const sameYear = (joblisting) => (joblisting.fromYear === joblisting.toYear);

export const Year = (joblisting) => (
  <div>
    {sameYear(joblisting) ? `${joblisting.fromYear}.` :
    `${joblisting.fromYear}. - ${joblisting.toYear}.`} klasse
   </div>
);

export const Workplaces = ({ places }) => (
  <div>
    {joinValues(places.map((place) => place.town))}
  </div>
);


export const Jobtype = (status) => {
  const jobtype = {
    'full_time': 'Fulltid',
    'part_time': 'Deltid',
    'summer_job': 'Sommerjobb',
    'other': 'Annet'
  };
  return jobtype[status];
};

function joinValues(values) {
  if (values.length < 2) {
    return values[0] || '';
  }

  return [
    values.slice(0, -1).join(', '),
    'og',
    values.slice(-1)
  ].join(' ');
}
