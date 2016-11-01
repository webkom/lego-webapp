export const selectJobtype = (status) => {
  const jobtype = {
    'full_time': 'Fulltid',
    'part_time': 'Deltid',
    'summer_job': 'Sommerjobb',
    'other': 'Annet'
  };
  return jobtype[status];
};

export const sameYear = (joblisting) => {
  return (joblisting.fromYear === joblisting.toYear);
};
