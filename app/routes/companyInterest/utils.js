export const sortSemesterChronologically = (a, b) => {
  const semesterCodeToPriority = {
    spring: 0,
    autumn: 1
  };
  return a.year !== b.year
    ? a.year - b.year
    : semesterCodeToPriority[a.semester] - semesterCodeToPriority[b.semester];
};
