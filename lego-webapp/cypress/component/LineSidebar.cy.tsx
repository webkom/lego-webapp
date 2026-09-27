import { LineSidebar } from '@webkom/lego-bricks';

const groupedItems = [
  {
    label: 'Generelt',
    children: [
      { label: 'Info om Abakus', href: '/pages/info-om-abakus' },
      { label: 'Budsjett', href: '/pages/budsjett' },
    ],
  },
  {
    label: 'Bedrifter',
    children: [{ label: 'For bedrifter', href: '/pages/for-bedrifter' }],
  },
  {
    label: 'Komiteer',
    children: Array.from({ length: 12 }, (_, index) => ({
      label: `Komité ${index + 1}`,
      href: `/pages/komiteer/${index + 1}`,
    })),
  },
];

const mountSidebar = (currentHref = '/pages/budsjett') =>
  cy.mount(
    <div style={{ width: '16rem' }}>
      <LineSidebar
        ariaLabel="Om Abakus"
        items={groupedItems}
        currentHref={currentHref}
      />
    </div>,
  );

describe('<LineSidebar />', () => {
  it('opens the section owning the current page and marks the page', () => {
    mountSidebar();

    cy.contains('button', 'Generelt').should(
      'have.attr',
      'aria-expanded',
      'true',
    );
    cy.contains('button', 'Bedrifter').should(
      'have.attr',
      'aria-expanded',
      'false',
    );
    cy.contains('a', 'Budsjett').should('have.attr', 'aria-current', 'page');
    cy.contains('a', 'Info om Abakus').should('not.have.attr', 'aria-current');
  });

  it('opens sections independently, so other sections stay put', () => {
    mountSidebar();

    cy.contains('button', 'Bedrifter').click();
    cy.contains('button', 'Bedrifter').should(
      'have.attr',
      'aria-expanded',
      'true',
    );
    cy.contains('button', 'Generelt').should(
      'have.attr',
      'aria-expanded',
      'true',
    );
    cy.contains('a', 'For bedrifter').should('be.visible');

    cy.contains('button', 'Generelt').click();
    cy.contains('button', 'Generelt').should(
      'have.attr',
      'aria-expanded',
      'false',
    );
    cy.contains('a', 'Budsjett').should('not.be.visible');
  });

  it('never moves the header that was clicked', () => {
    mountSidebar();

    cy.contains('button', 'Komiteer').then(($button) => {
      const before = $button[0].getBoundingClientRect().top;
      cy.wrap($button).click();
      // Wait for the panel transition to finish before measuring again.
      cy.contains('a', 'Komité 12').should('be.visible');
      cy.contains('button', 'Komiteer').should(($after) => {
        expect($after[0].getBoundingClientRect().top).to.equal(before);
      });
    });
  });

  it('keeps its width when a section expands', () => {
    mountSidebar();

    cy.get('nav[aria-label="Om Abakus"]').then(($nav) => {
      const width = $nav[0].getBoundingClientRect().width;
      cy.contains('button', 'Komiteer').click();
      cy.contains('a', 'Komité 12').should('be.visible');
      cy.get('nav[aria-label="Om Abakus"]').should(($after) => {
        expect($after[0].getBoundingClientRect().width).to.equal(width);
      });
    });
  });

  it('keeps collapsed sections out of the tab order', () => {
    mountSidebar();

    // visibility: hidden removes the links from both tab order and a11y tree.
    cy.contains('a', 'For bedrifter').should(
      'have.css',
      'visibility',
      'hidden',
    );
  });

  it('opens the new current section after navigation without closing others', () => {
    mountSidebar('/pages/budsjett');
    cy.contains('button', 'Bedrifter').should(
      'have.attr',
      'aria-expanded',
      'false',
    );

    mountSidebar('/pages/for-bedrifter');
    cy.contains('button', 'Bedrifter').should(
      'have.attr',
      'aria-expanded',
      'true',
    );
  });

  it('puts the bead only on the rod of the current section', () => {
    mountSidebar();

    cy.contains('button', 'Bedrifter').click();
    cy.get('[data-line-sidebar-bead]').should('have.length', 3);
    cy.contains('button', 'Generelt')
      .next()
      .find('[data-line-sidebar-bead]')
      .should('have.css', 'opacity', '1');
    cy.contains('button', 'Bedrifter')
      .next()
      .find('[data-line-sidebar-bead]')
      .should('have.css', 'opacity', '0');
  });

  it('calls onItemClick with the page label', () => {
    const onItemClick = cy.stub().as('onItemClick');
    cy.mount(
      <LineSidebar
        items={groupedItems}
        currentHref="/pages/budsjett"
        onItemClick={(label) => {
          onItemClick(label);
        }}
      />,
    );

    cy.contains('a', 'Info om Abakus').then(($link) => {
      $link[0].addEventListener('click', (event) => event.preventDefault());
    });
    cy.contains('a', 'Info om Abakus').click();
    cy.get('@onItemClick').should('have.been.calledOnceWith', 'Info om Abakus');
  });

  it('renders a rich label node in place of the plain label', () => {
    cy.mount(
      <LineSidebar
        items={[
          {
            label: 'Generelt',
            children: [
              {
                label: 'readme',
                labelNode: <strong data-test-id="rich-label">readme</strong>,
                href: '/pages/readme',
              },
            ],
          },
        ]}
        currentHref="/pages/readme"
      />,
    );

    cy.get('[data-test-id="rich-label"]').should('be.visible');
  });
});
