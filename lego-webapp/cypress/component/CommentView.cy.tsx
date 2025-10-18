import CommentView from '../../components/Comments/CommentView'
import comments from '../fixtures/comments';

describe('<CommentView />', () => {
  beforeEach(() => {
    cy.mount(<CommentView contentTarget='articles.article-1' comments={comments} />)
  })

  it('renders a comment tree', () => {
    cy.get('[data-testid="comment-tree"]').should('exist');
  })

  it('renders all comments', () => {
    cy.get('[data-testid="comment"]').then(($comments) => {
      expect($comments.length).to.equal(comments.length);
    });
  })

  it('renders the top level comments at root level', () => {
    cy.get('[data-ischild="false"]').then(($rootComments) => {
      const rootCommentsCount = comments.filter(comment => comment.parent === null).length;
      expect($rootComments.length).to.equal(rootCommentsCount);
    })
  })

  it('renders nested comments', () => {
    cy.get('[data-ischild="true"]').then(($nestedComments) => {
      const nestedCommentsCount = comments.filter(comment => comment.parent !== null).length;
      expect($nestedComments.length).to.equal(nestedCommentsCount);
    });
  });
})