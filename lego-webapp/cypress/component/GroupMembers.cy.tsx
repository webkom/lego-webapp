import { PageContextProvider } from 'vike-react/usePageContext';
import memberships from '../fixtures/memberships';
import GroupMembersList from '~/pages/admin/groups/@groupId/members/GroupMembersList';

const mockPageContext = {
  urlParsed: { pathname: '/mock/path', search: '' },
  query: { descendants: 'true' },
  setQuery: () => {},
};

const mountWithPageContext = (component: React.ReactNode) => {
  return cy.mount(
    <PageContextProvider pageContext={mockPageContext as any}>
      {component}
    </PageContextProvider>,
  );
};

const _GroupMembersList = ({ memberships }: { memberships: any }) => (
  <GroupMembersList
    memberships={memberships}
    fetching={false}
    hasMore={false}
    fetchMemberships={async () => {}}
  />
);

describe('<GroupMembersList />', () => {
  it('should render "No users" for an empty array', () => {
    mountWithPageContext(<_GroupMembersList memberships={[]} />);
    cy.get('tr')
      .should('exist')
      .and('have.length', 0 + 1); // +1 for header row
  });

  it('should render an <ul> of users', () => {
    mountWithPageContext(<_GroupMembersList memberships={memberships} />);
    cy.get('tr')
      .should('exist')
      .and('have.length', memberships.length + 1); // +1 for header row
  });

  it('should include links for all users in the list', () => {
    mountWithPageContext(<_GroupMembersList memberships={memberships} />);

    cy.get('tr').then(($rows) => {
      const links = $rows.find('a');
      expect(links).to.have.length(memberships.length);
      links.each((index, link) => {
        const user = memberships[index].user;
        expect(link).to.have.attr('href', `/users/${user.username}`);
        expect(link).to.contain.text(`${user.fullName} (${user.username})`);
      });
    });
  });
});
