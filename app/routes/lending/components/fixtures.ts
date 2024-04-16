import moment from 'moment';
import {
  LendingRequestStatus,
  type LendingRequest,
} from 'app/store/models/LendingRequest';
import type {
  DetailedLendableObject,
  ListLendableObject,
} from 'app/store/models/LendableObject';

/* 
TODO: Remove when fixtures exist in backend
*/

export const exampleListLendableObjects: ListLendableObject[] = [
  {
    id: 1,
    title: 'Grill',
    image: 'https://food.unl.edu/newsletters/images/grilled-kabobs.jpg',
  },
  {
    id: 2,
    title: 'Soundboks',
    image: 'https://food.unl.edu/newsletters/images/grilled-kabobs.jpg',
  },
  {
    id: 3,
    title: 'Soundboks2',
    image: 'https://food.unl.edu/newsletters/images/grilled-kabobs.jpg',
  },
  {
    id: 4,
    title: 'Prinsessekjole',
    image: 'https://food.unl.edu/newsletters/images/grilled-kabobs.jpg',
  },
  {
    id: 5,
    title: 'Falk',
    image: 'https://food.unl.edu/newsletters/images/grilled-kabobs.jpg',
  },
];

export const exampleDetailedLendableObjects: DetailedLendableObject[] = [
  {
    id: 1,
    title: 'Grill',
    image: 'https://food.unl.edu/newsletters/images/grilled-kabobs.jpg',
    description: 'En grill til å grille',
    location: 'A3',
    hasContract: false,
    maxLendingPeriod: moment.duration('1 day'),
    responsibleGroups: [],
    responsibleRoles: [],
  },
  {
    id: 2,
    title: 'Soundboks',
    image: 'https://food.unl.edu/newsletters/images/grilled-kabobs.jpg',
    description: 'En soundboks til å soundbokse',
    location: 'A3',
    hasContract: false,
    maxLendingPeriod: moment.duration('1 day'),
    responsibleGroups: [],
    responsibleRoles: [],
  },
];

export const exampleRequests: LendingRequest[] = [
  {
    id: 1,
    user: {
      id: 1,
      firstName: 'Test',
      lastName: 'Testesen',
      fullName: 'Test Testesen',
      username: 'testes',
      grade: {
        name: 'yuh',
      },
      abakusGroups: [],
      gender: 'apache helicopter',
      allergies: '',
      profilePicture: '',
      photoConsents: [],
    },
    startDate: moment().subtract({ hours: 2 }),
    endDate: moment(),
    message: 'Jeg vil gjerne låne Soundboks til hyttetur:)',
    status: LendingRequestStatus.PENDING,
    lendableObject: {
      id: 1,
      title: 'Grill',
      image: 'https://food.unl.edu/newsletters/images/grilled-kabobs.jpg',
    },
  },
  {
    id: 2,
    user: {
      id: 1,
      firstName: 'Test',
      lastName: 'Testesen',
      fullName: 'Test Testesen',
      username: 'testes',
      grade: {
        name: 'yuh',
      },
      abakusGroups: [],
      gender: 'apache helicopter',
      allergies: '',
      profilePicture: '',
      photoConsents: [],
    },
    startDate: moment().subtract({ days: 2 }),
    endDate: moment().subtract({ days: 1 }),
    message: 'Jeg vil gjerne låne Soundboks til hyttetur:)',
    status: LendingRequestStatus.DENIED,
    lendableObject: {
      id: 1,
      title: 'Grill',
      image: 'https://food.unl.edu/newsletters/images/grilled-kabobs.jpg',
    },
  },
  {
    id: 3,
    user: {
      id: 1,
      firstName: 'Test',
      lastName: 'Testesen',
      fullName: 'Test Testesen',
      username: 'testes',
      grade: {
        name: 'yuh',
      },
      abakusGroups: [],
      gender: 'apache helicopter',
      allergies: '',
      profilePicture: '',
      photoConsents: [],
    },
    startDate: moment().add({ hours: 2 }),
    endDate: moment().add({ hours: 4 }),
    message: 'Jeg vil gjerne låne Soundboks til hyttetur:)',
    status: LendingRequestStatus.APPROVED,
    lendableObject: {
      id: 1,
      title: 'Grill',
      image: 'https://food.unl.edu/newsletters/images/grilled-kabobs.jpg',
    },
  },
  {
    id: 4,
    user: {
      id: 1,
      firstName: 'Test',
      lastName: 'Testesen',
      fullName: 'Test Testesen',
      username: 'testes',
      grade: {
        name: 'yuh',
      },
      abakusGroups: [],
      gender: 'apache helicopter',
      allergies: '',
      profilePicture: '',
      photoConsents: [],
    },
    startDate: moment().add({ hours: 2 }),
    endDate: moment().add({ hours: 4 }),
    message: 'Jeg vil gjerne låne Soundboks til hyttetur:)',
    status: LendingRequestStatus.DENIED,
    lendableObject: {
      id: 1,
      title: 'Grill',
      image: 'https://food.unl.edu/newsletters/images/grilled-kabobs.jpg',
    },
  },
];

export const lendableObject: DetailedLendableObject = {
  id: 1,
  title: 'Soundbox',
  description: 'En soundbox som kan brukes til å spille av lyder',
  // lendingCommentPrompt: 'Hvorfor ønsker du å låne soundboks',
  image: 'https://www.tntpyro.no/wp-content/uploads/2021/08/141_1283224098.jpg',
  location: 'someplace',
  hasContract: false,
  maxLendingPeriod: null,
  responsibleRoles: [],
  responsibleGroups: [],
};

export const request = {
  id: 1,
  user: {
    username: 'PeterTesterIProd',
    fullName: 'Peter TesterIProd',
  },
  startDate: moment().subtract({ hours: 2 }),
  endDate: moment(),
  message: 'Jeg vil gjerne låne Soundboks til hyttetur:)',
  status: LendingRequestStatus.PENDING,
  lendableObject: {
    id: 1,
    title: 'Grill',
    image: 'https://food.unl.edu/newsletters/images/grilled-kabobs.jpg',
  },
};

export const otherLoans = [
  {
    id: 2,
    startDate: moment().subtract({ days: 1, hours: 2 }),
    endDate: moment().subtract({ hours: 8 }),
  },
  {
    id: 3,
    startDate: moment().subtract({ hours: 6 }),
    endDate: moment().subtract({ hours: 2 }),
  },
];

export const requestEvent = {
  id: String(request.id),
  title: request.user.fullName,
  start: request.startDate.toISOString(),
  end: request.endDate.toISOString(),
  backgroundColor: '#e11617',
  borderColor: '#e11617',
};

export const otherLoanEvents = otherLoans.map((loan) => ({
  id: String(loan.id),
  title: 'Test',
  start: loan.startDate.toISOString(),
  end: loan.endDate.toISOString(),
  backgroundColor: '#999999',
  borderColor: '#999999',
}));

export const otherLoanRequests = [
  {
    id: 5,
    startDate: moment().subtract({ hours: 2 }),
    endDate: moment().add({ hours: 2 }),
  },
];

export const otherLoanRequestEvents = otherLoanRequests.map((loan) => ({
  id: String(loan.id),
  title: 'Test',
  start: loan.startDate.toISOString(),
  end: loan.endDate.toISOString(),
  backgroundColor: '#f57676',
  borderColor: '#f57676',
}));
