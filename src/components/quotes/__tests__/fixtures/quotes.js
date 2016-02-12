export default (hasLiked = false, approved = true) => ([
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
    hasLiked,
    approved
  },
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
    hasLiked,
    approved
  }
]);

export const createProps = (filter, path = '/quotes') => ({
  routeParams: { filter },
  route: { path }
});
