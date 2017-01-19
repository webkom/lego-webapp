import React from 'react';

const sameYear = (joblisting) => (joblisting.fromYear === joblisting.toYear);

export const Year = (joblisting) => (
  <div>
    {sameYear(joblisting) ? `${joblisting.fromYear}.` :
    `${joblisting.fromYear}. - ${joblisting.toYear}.`} klasse
   </div>
);

export const Workplaces = ({ places }) => {
  console.log('places', places);
  let towns;
  if (places.length > 1) {
    towns = places.reduce((a, b) => {
      console.log(a, b);
      return (`${a.town}, ${b.town}`);
    });
  } else {
    towns = places[0].town;
  }
  return (
    <div>
      {towns}
    </div>
  );
};

export const Jobtype = (status) => {
  const jobtype = {
    'full_time': 'Fulltid',
    'part_time': 'Deltid',
    'summer_job': 'Sommerjobb',
    'other': 'Annet'
  };
  return jobtype[status];
};
