import GroupTree from '../../pages/admin/groups/GroupTree';
import groups from '../fixtures/groups';

describe('<GroupTree />', () => {
  it('should render the child nodes as links', () => {
    cy.mount(<GroupTree groups={groups} pathname="/admin/groups/1/settings" />);
    cy.get('a').should('have.length', groups.length);
    cy.get('a[href="/admin/groups/2/settings"]').should('exist');
    cy.get('a[href="/admin/groups/3/settings"]').should('exist');
  });
  it('should render the root nodes correctly', () => {
    cy.mount(<GroupTree groups={groups} pathname="/admin/groups/1/settings" />);
    cy.get('[data-testid="group-tree"]')
      .children()
      .eq(1)
      .within(() => {
        cy.get('[data-testid="tree-view"]').should('exist');
      });
  });
  it('should work with only root groups', () => {
    const rootGroups = groups.slice(0, 1);
    cy.mount(
      <GroupTree groups={rootGroups} pathname="/admin/groups/1/settings" />,
    );
    cy.get('a').should('have.length', 1);
    cy.get('[data-testid="tree-view"]').should('not.exist');
  });
  it('should preserve the selected tab', () => {
    cy.mount(
      <GroupTree
        groups={groups}
        pathname="/admin/groups/1/members?descendants=false"
      />,
    );
    cy.get('a[href="/admin/groups/2/members?descendants=false"]')
      .should('exist')
      .and('have.text', 'Dog');
    cy.get('a[href="/admin/groups/3/members?descendants=false"]')
      .should('exist')
      .and('have.text', 'Bird');
  });
});
