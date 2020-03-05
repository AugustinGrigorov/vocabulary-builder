const UPDATED_WORLD = 'updated test word';
const UPDATED_DEFINITION = 'updated test definition';
const UPDATED_EXAMPLE = 'updated test example';
const TEST_ENTRY_DATA = {
  word: 'test word',
  definition: 'test definition',
  example: 'test example',
  type: 'noun',
  theme: 'none',
};

describe('Learn page', () => {
  beforeEach(() => {
    cy.visit('/learn');
    cy.clearAllEntries();
  });

  it('creates a word correcly', () => {
    const { word, definition, example } = TEST_ENTRY_DATA;
    cy.get('div[data-cy="editor"]').click();
    cy.get('#word').type(word, { force: true });
    cy.get('#definition').type(definition, { force: true });
    cy.get('#example').type(example, { force: true });
    cy.get('div[data-cy="editor"] input[type="submit"]').click({ force: true });
    cy.get('div[class^="Card__Container"]:nth-child(2) h2').should('contain', word);
    cy.get('div[class^="Card__Container"]:not([data-cy="pending"]):not([data-cy="editor"])').then(() => {
      cy.get('div[class^="Card__Container"]:nth-child(2)').click();
      cy.get('div[class^="Card__Container"]:nth-child(2) h2[class^="WordCard__Word"]').should('contain', word);
      cy.get('div[class^="Card__Container"]:nth-child(2) p[class^="WordCard__Definition"]').should('contain', definition);
      cy.get('div[class^="Card__Container"]:nth-child(2) p[class^="WordCard__Example"]').should('contain', example);
    });
  });

  it('edits a word successfully', () => {
    cy.addEntry(TEST_ENTRY_DATA);
    cy.get('div[class^="Card__Container"]:not([data-cy="pending"]):not([data-cy="editor"])').then(() => {
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
  });

  it('deletes a word successfully', () => {
    cy.addEntry(TEST_ENTRY_DATA);
    cy.get('div[class^="Card__Container"]:not([data-cy="pending"]):not([data-cy="editor"])').then(() => {
      cy.get('div[class^="Card__Container"]:nth-child(2)').click();
      cy.get('svg[class*="WordCard__RemoveButton"]').click({ force: true });
      cy.get('div[class^="Card__Container"]:nth-child(2)').should('not.exist');
    });
  });
});
