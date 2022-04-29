import {
  c,
  field,
  fieldError,
  selectField,
  selectFieldDropdown,
} from '../support/utils.js';

describe('Polls', () => {
  beforeEach(() => {
    cy.resetDb();
    cy.cachedLogin();
  });

  const poll_form = {
    title: 'testquestion',
    description: 'this is a poll',
    pinned: false,
    tag: 'webkom',
    choice_1: 'Choice A',
    choice_2: 'Choice B',
    choice_3: 'Choice C',
  };

  it('can create poll', () => {
    cy.visit('/polls');

    cy.contains('a', 'Lag ny').click();

    cy.url().should('include', `/polls/new`);

    cy.contains('Lag ny avstemning').should('be.disabled');

    field('title').type(poll_form.title).blur();

    cy.contains('Lag ny avstemning').should('not.be.disabled').click();

    fieldError('options[0].name').should('exist');
    fieldError('options[1].name').should('exist');

    field('options[0].name').type(poll_form.choice_1).blur();
    field('options[1].name').type(poll_form.choice_2).blur();

    fieldError('options[0].name').should('not.exist');
    fieldError('options[1].name').should('not.exist');

    cy.contains('Lag ny avstemning').should('not.be.disabled');

    cy.contains('a', 'Valg').click(); // add third choice
    field('options[2].name').type(poll_form.choice_3).blur();

    // Add fourth option and remove it
    cy.contains('a', 'Valg').click();
    field('options[3].name')
      .parents('li')
      .find(c('PollEditor__deleteOption'))
      .click();
    cy.get(c('Modal__content')).should('be.visible').contains('Ja').click();

    field('description').type(poll_form.description).blur();
    if (poll_form.pinned) {
      field('pinned').check();
    }

    selectField('tags').click();
    cy.focused().type(poll_form.tag, { force: true });
    selectFieldDropdown('tags').should((results) => {
      expect(results).to.not.contain('Create option');
      expect(results).to.contain('webkom');
    });
    cy.focused().type('{enter}', { force: true });

    cy.contains('Lag ny avstemning').click();
    cy.url().should('not.include', `/polls/new`);
    cy.url().should('include', `/polls`);

    cy.contains(poll_form.title).click();
    cy.contains(poll_form.title);
    cy.contains(poll_form.description);
    cy.contains(poll_form.choice_1);
    cy.contains(poll_form.choice_2);
    cy.contains(poll_form.choice_3);
    // TODO: poll does not show its tags
    // cy.contains(poll_form.tag);
  });

  it('can answer poll', () => {
    cy.visit('/polls/2');
    cy.contains('Stemmer: 13');
    cy.contains('yo').click();
    cy.contains('Stemmer: 14');
  });

  it('can edit poll and answer it on frontpage', () => {
    cy.visit('/polls/1');
    cy.contains('a', 'Rediger').click();
    field('title').clear().type(poll_form.title);
    field('pinned').check();

    cy.get(c('PollEditor__deleteOption')).first().click();
    cy.get(c('Modal__content')).should('be.visible').contains('Ja').click();
    cy.get(c('PollEditor__deleteOption')).first().click();
    cy.get(c('Modal__content')).should('be.visible').contains('Ja').click();
    cy.get(c('PollEditor__deleteOption')).first().click();
    cy.get(c('Modal__content')).should('be.visible').contains('Ja').click();
    cy.get(c('PollEditor__deleteOption')).first().click();
    cy.get(c('Modal__content')).should('be.visible').contains('Ja').click();

    cy.contains('a', 'Valg').click();
    cy.contains('a', 'Valg').click();

    field('options[0].name').type(poll_form.choice_1).blur();
    field('options[1].name').type(poll_form.choice_2).blur();

    cy.contains('Endre avstemning').click();

    // cannot check url because there is no url change on save, so let's check that the button disappears
    cy.contains('Endre avstemning').should('not.exist');
    cy.contains(poll_form.title);
    cy.contains(poll_form.choice_1);
    cy.contains(poll_form.choice_2);

    cy.visit('/');
    cy.contains('Avstemning');
    cy.contains(poll_form.title);
    cy.contains('Stemmer: 0');
    cy.get(c('Poll__bottomBar')).first().click();
    cy.contains(poll_form.choice_1).click();
    cy.contains('Stemmer: 1');
    cy.contains('div', poll_form.title).click();
    cy.url().should('include', '/polls');
  });

  it('can delete poll', () => {
    cy.visit('/polls');
    cy.get(c('PollsList__pollListItem')).should('have.length', 2);

    cy.get(c('PollsList__heading')).first().click();

    cy.contains('a', 'Rediger').click();
    cy.contains('Slett').click();
    cy.get(c('Modal__content')).should('be.visible').contains('Ja').click();

    cy.get(c('Modal__content')).should('not.exist');

    cy.visit('/polls');

    cy.get(c('PollsList__pollListItem')).should('have.length', 1);
  });
});
