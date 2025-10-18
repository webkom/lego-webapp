import LoginForm from '~/components/LoginForm/LoginForm';


describe('<LoginForm />', () => {
    beforeEach(() => {
        cy.mount(<LoginForm />);
    });

    it('should render correctly', () => {
        cy.get('form').within(() => {
            cy.get('input[name="username"]').should('exist');
            cy.get('input[name="password"]').should('exist').and('have.attr', 'type', 'password');
        });
    });
})