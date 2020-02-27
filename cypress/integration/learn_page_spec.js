const WORD = 'test word';
const DEFINITION = 'test definition';
const EXAMPLE = 'test example';

describe('Learn page', () => {
  it('successfully loads', () => {
    cy.visit('/learn');
  });

  it('creates a word correcly', () => {
    cy.get('div[data-cy="editor"]').click();
    cy.get('input[id="word"]').type(WORD, { force: true });
    cy.get('input[id="definition"]').type(DEFINITION, { force: true });
    cy.get('input[id="example"]').type(EXAMPLE, { force: true });
    cy.get('div[data-cy="editor"] input[type="submit"]').click({ force: true });
    cy.get('div[class^="Card__Container"]:nth-child(2) h2').should('contain', WORD);
    cy.get('div[class^="Card__Container"]:not([data-cy="pending"]):not([data-cy="editor"])').then(() => {
      cy.get('div[class^="Card__Container"]:nth-child(2)').click();
      cy.get('div[class^="Card__Container"]:nth-child(2) h2[class^="WordCard__Word"]').should('contain', WORD);
      cy.get('div[class^="Card__Container"]:nth-child(2) p[class^="WordCard__Definition"]').should('contain', DEFINITION);
      cy.get('div[class^="Card__Container"]:nth-child(2) p[class^="WordCard__Example"]').should('contain', EXAMPLE);
    });
  });
});
