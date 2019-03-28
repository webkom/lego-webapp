import { c, field, fieldError } from '../support/utils.js';

describe('Polls', () => {
  beforeEach(() => cy.login());

  const poll_form = {
    title: `testquestion ${+new Date()}`, // Make every title unique so tests cannot pass because of a leftover poll
    description: 'this is a poll',
    pinned: false,
    tag: 'webkom',
    choice_1: 'Choice A',
    choice_2: 'Choice B',
    choice_3: 'Choice C'
  };

  const makePoll = () => ({
    title: `testquestion ${+new Date()}`, // Make every title unique so tests cannot pass because of a leftover poll
    description: 'this is a poll',
    pinned: true,
    tags: ['webkom'],
    options: [
      {
        name: 'A'
      },
      {
        name: 'B'
      }
    ]
  });

  it.only('can create and delete poll', () => {
    cy.visit('/polls');

    cy.contains('a', 'Lag ny').click();

    cy.url().should('include', `/polls/new`);

    cy.contains('Lag ny avstemning').should('be.disabled');

    field('title')
      .type(poll_form.title)
      .blur();

    cy.contains('Lag ny avstemning')
      .should('not.be.disabled')
      .click();

    fieldError('options[0].name').should('exist');
    fieldError('options[1].name').should('exist');

    field('options[0].name')
      .type(poll_form.choice_1)
      .blur();
    field('options[1].name')
      .type(poll_form.choice_2)
      .blur();

    fieldError('options[0].name').should('not.exist');
    fieldError('options[1].name').should('not.exist');

    cy.contains('Lag ny avstemning').should('not.be.disabled');

    cy.contains('a', 'Valg').click(); // add third choice
    field('options[2].name')
      .type(poll_form.choice_3)
      .blur();

    // Add fourth option and remove it
    cy.contains('a', 'Valg').click();
    field('options[3].name')
      .parents('li')
      .find(c('PollEditor__deleteOption'))
      .click();
    cy.get(c('Modal__content'))
      .should('be.visible')
      .contains('Ja')
      .click();

    field('description')
      .type(poll_form.description)
      .blur();
    if (poll_form.pinned) {
      field('pinned').check();
    }

    cy.contains('Tags')
      .find('.Select')
      .click();
    cy.focused().type(poll_form.tag, { force: true });
    cy.contains('Tags')
      .find('.Select-menu-outer')
      .should(results => {
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

    cy.contains('a', 'Rediger').click();
    cy.contains('Slett').click();
    cy.get(c('Modal__content'))
      .should('be.visible')
      .contains('Ja')
      .click();

    cy.get(c('Modal__content')).should('not.exist');
    cy.contains(poll_form.title).should('not.exist');
  });

  it.skip('can see and answer poll from frontpage', () => {
    // TODO: create poll before voting..
    cy.visit('/');
    cy.contains('Avstemning');
    cy.contains(poll_form.title);
    cy.contains('Stemmer: 0');
    cy.contains(poll_form.choices[0]).click();
    cy.contains('Stemmer: 1');
    cy.contains('a', poll_form.title).click();
    cy.url().should('include', '/polls');
  });

  it.skip('can answer poll', () => {});

  it.skip('can edit poll', () => {});

  it.skip('can delete poll', () => {});
});
