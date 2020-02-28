const WORD = 'test word';
const DEFINITION = 'test definition';
const EXAMPLE = 'test example';
const UPDATED_WORLD = 'updated test word';
const UPDATED_DEFINITION = 'updated test definition';
const UPDATED_EXAMPLE = 'updated test example';

describe('Learn page', () => {
  it('successfully loads', () => {
    cy.visit('/learn');
  });

  it('creates a word correcly', () => {
    cy.get('div[data-cy="editor"]').click();
    cy.get('#word').type(WORD, { force: true });
    cy.get('#definition').type(DEFINITION, { force: true });
    cy.get('#example').type(EXAMPLE, { force: true });
    cy.get('div[data-cy="editor"] input[type="submit"]').click({ force: true });
    cy.get('div[class^="Card__Container"]:nth-child(2) h2').should('contain', WORD);
    cy.get('div[class^="Card__Container"]:not([data-cy="pending"]):not([data-cy="editor"])').then(() => {
      cy.get('div[class^="Card__Container"]:nth-child(2)').click();
      cy.get('div[class^="Card__Container"]:nth-child(2) h2[class^="WordCard__Word"]').should('contain', WORD);
      cy.get('div[class^="Card__Container"]:nth-child(2) p[class^="WordCard__Definition"]').should('contain', DEFINITION);
      cy.get('div[class^="Card__Container"]:nth-child(2) p[class^="WordCard__Example"]').should('contain', EXAMPLE);
    });
  });
  it('edits a word successfully', () => {
    cy.get('svg[class*="WordCard__EditButton"]').click({ force: true });
    cy.get('div[class^="Card__Container"]:nth-child(2) #word').clear({ force: true }).type(UPDATED_WORLD, { force: true });
    cy.get('div[class^="Card__Container"]:nth-child(2) #definition').clear({ force: true }).type(UPDATED_DEFINITION, { force: true });
    cy.get('div[class^="Card__Container"]:nth-child(2) #example').clear({ force: true }).type(UPDATED_EXAMPLE, { force: true });
    cy.get('div[class^="Card__Container"]:nth-child(2) input[class^="WordForm__Submit"]').click({ force: true });
    cy.get('div[class^="Card__Container"]:not([data-cy="pending"]):not([data-cy="editor"])').then(() => {
      cy.get('div[class^="Card__Container"]:nth-child(2)').click();
      cy.get('div[class^="Card__Container"]:nth-child(2) h2[class^="WordCard__Word"]').should('contain', UPDATED_WORLD);
      cy.get('div[class^="Card__Container"]:nth-child(2) p[class^="WordCard__Definition"]').should('contain', UPDATED_DEFINITION);
      cy.get('div[class^="Card__Container"]:nth-child(2) p[class^="WordCard__Example"]').should('contain', UPDATED_EXAMPLE);
    });
  });
  it('deletes a word successfully', () => {
    cy.get('div[class^="Card__Container"]:nth-child(2)').click();
    cy.get('svg[class*="WordCard__RemoveButton"]').click({ force: true });
    cy.get('div[class^="Card__Container"]:nth-child(2)').should('not.exist');
  });
});
