describe('Product catalog', () => {
  it('searches, handles no results, and restores the collection', () => {
    cy.visit('/');
    cy.get('article').should('have.length', 6);
    cy.get('input[type="search"]').type('  HEADPHONES  ');
    cy.get('article').should('have.length', 1).and('contain', 'Wireless Headphones');
    cy.get('input[type="search"]').clear().type('no-such-product');
    cy.contains('No products found').should('be.visible');
    cy.contains('ion-button', 'Reset filters').click();
    cy.get('article').should('have.length', 6);
    cy.contains('ion-button', 'Home').click();
    cy.get('article').should('have.length', 1).and('contain', 'Table Lamp');
  });
});
