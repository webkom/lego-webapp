describe('The Home Page', () => {
  it('successfully loads', () => {
    cy.visit('/');
    cy.contains('Velkommen');
    cy.contains('Om Abakus');
  });
  it('can log in from homepage', () => {
    cy.get('[name=username]').type('webkom');
    cy.get('[name=password]').type('webkom{enter}');
  });

  it('can see upcoming bedpres and kurs', () => {
    cy.contains('Bedpres og Kurs');
  });
  it('can see upcoming events', () => {
    cy.contains('Arrangementer');
  });
});
