import {
  c,
  t,
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

    cy.contains('button', 'Lag ny').click();

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

    cy.contains('button', 'Legg til alternativ').click(); // add third choice
    field('options[2].name').type(poll_form.choice_3).blur();

    // Add new option and remove it
    cy.contains('button', 'Legg til alternativ').click();
    cy.get(c('deleteOption')).last().click();
    cy.get(t('Modal__content')).should('be.visible').contains('Ja').click();

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
    cy.contains('13 stemmer');
    cy.contains('yo').click();
    cy.contains('14 stemmer');
  });

  it('can edit poll and answer it on frontpage', () => {
    cy.visit('/polls/1');
    cy.contains('button', 'Rediger').click();
    field('title').clear().type(poll_form.title);
    field('pinned').check();

    cy.get(c('deleteOption')).first().click();
    cy.get(t('Modal__content')).should('be.visible').contains('Ja').click();
    cy.get(c('deleteOption')).first().click();
    cy.get(t('Modal__content')).should('be.visible').contains('Ja').click();
    cy.get(c('deleteOption')).first().click();
    cy.get(t('Modal__content')).should('be.visible').contains('Ja').click();
    cy.get(c('deleteOption')).first().click();
    cy.get(t('Modal__content')).should('be.visible').contains('Ja').click();

    cy.contains('button', 'Legg til alternativ').click();
    cy.contains('button', 'Legg til alternativ').click();

    field('options[0].name').type(poll_form.choice_1).blur();
    field('options[1].name').type(poll_form.choice_2).blur();

    cy.contains('Lagre endringer').click();

    // cannot check url because there is no url change on save, so let's check that the button disappears
    cy.contains('Lagre endringer').should('not.exist');
    cy.contains(poll_form.title);
    cy.contains(poll_form.choice_1);
    cy.contains(poll_form.choice_2);

    cy.visit('/');
    cy.contains('Avstemning');
    cy.contains(poll_form.title);
    cy.contains('0 stemmer');
    cy.contains(poll_form.choice_1).click();
    cy.contains('1 stemme');
    cy.contains('a', poll_form.title).click();
    cy.url().should('include', '/polls');
  });

  it('can delete poll', () => {
    cy.visit('/polls');
    cy.get(c('PollsList__pollListItem')).should('have.length', 2);

    cy.get(c('PollsList__heading')).first().click();

    cy.contains('button', 'Rediger').click();
    cy.contains('button', 'Slett avstemning').click();
    cy.get(t('Modal__content')).should('be.visible').contains('Ja').click();

    cy.get(t('Modal__content')).should('not.exist');

    cy.visit('/polls');

    cy.get(c('PollsList__pollListItem')).should('have.length', 1);
  });
});
