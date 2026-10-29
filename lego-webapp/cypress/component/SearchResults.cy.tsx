import QuickLinks from '~/components/Search/QuickLinks';
import styles from '~/components/Search/Search.module.css';
import SearchResults from '~/components/Search/SearchResults';
import '~/styles/globals.css';

describe('Search results layout', () => {
  const title = 'A long search result title '.repeat(30);

  for (const width of [320, 375, 768, 1440]) {
    it(`keeps long results inside a ${width}px viewport`, () => {
      cy.viewport(width, 812);
      cy.mount(
        <div className={styles.wrapper} data-testid="search-wrapper">
          <div className={styles.content} data-testid="search-content">
            <div className={styles.resultsContainer}>
              <SearchResults
                searching={false}
                results={[{ label: title, title, link: '/events/1/' }]}
                selectedIndex={-1}
                query="event"
                onCloseSearch={() => {}}
              />
              <div className={styles.sidePanel}>
                <QuickLinks
                  title="Sider"
                  links={[['/events/', 'Arrangementer']]}
                  onCloseSearch={() => {}}
                />
              </div>
            </div>
          </div>
        </div>,
      );

      cy.get('[data-testid="search-content"]').should(($content) => {
        const bounds = $content[0].getBoundingClientRect();
        expect(bounds.left).to.be.at.least(0);
        expect(bounds.right).to.be.at.most(width);
        expect(bounds.width).to.equal(Math.min(width, 1280));
      });
      cy.get('[data-testid="search-wrapper"]').should(($wrapper) => {
        expect($wrapper[0].scrollWidth).to.equal($wrapper[0].clientWidth);
      });
      cy.contains('a', title).should('have.attr', 'href', '/events/1/');
    });
  }
});
