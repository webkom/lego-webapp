export const quotes = [
  {
    author: {
      firstName: 'webkom',
      fullName: 'webkom webkom',
      id: 1,
      lastName: 'webkom',
      username: 'webkom'
    },
    createdAt: '2015-11-07T22:05:36.881015Z',
    id: 1,
    likes: 1,
    permissions: [
      'can_approve'
    ],
    source: 'kotlarz',
    text: 'test quote 1',
    title: 'test title 1',
    hasLiked: false,
    approved: true
  },
  {
    author: {
      firstName: 'webkom',
      fullName: 'webkom webkom',
      id: 1,
      lastName: 'webkom',
      username: 'webkom'
    },
    createdAt: '2015-11-08T22:05:36.881015Z',
    id: 2,
    likes: 2,
    permissions: [
      'can_approve'
    ],
    source: 'finn',
    text: 'test quote 2',
    title: 'test title 2',
    hasLiked: false,
    approved: true
  }
];

export function singleQuote(hasLiked = false, approved = true, index = 0) {
  return {
    ...quotes[index],
    hasLiked,
    approved
  };
}

// I can't find a way to actually copy quotes without just making a new reference to it.
// Send help
export const createQuotes = quotes.slice(0);

export const createProps = (filter, path = '/quotes') => ({
  routeParams: { filter },
  route: { path },
  query: { filter }
});
