export const selectJobtype = (status) => {
  console.log('yo');
  const jobtype = {
    0: 'Fulltid',
    1: 'Deltid',
    2: 'Sommerjobb',
    3: 'Annet'
  };
  return jobtype[status];
};
