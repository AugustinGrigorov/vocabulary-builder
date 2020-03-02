import 'cypress-wait-until';

import {
  addEntry,
  removeEntry,
  fetchDictionaryForUser,
} from '../../src/actions';

Cypress.Commands.add('refetchDictionary', () => {
  cy.window().its('store').then((store) => {
    const { user } = store.getState();
    store.dispatch(fetchDictionaryForUser(user.details.uid));
  });
  cy.waitUntil(() => cy.window().its('store').invoke('getState').its('dictionary.initialized')
    .then((dictInit) => dictInit === true));
});

Cypress.Commands.add('clearAllEntries', () => {
  cy.waitUntil(() => cy.window().its('store').invoke('getState').its('dictionary.initialized')
    .then((dictInit) => dictInit === true));
  cy.window().its('store').then((store) => {
    const { dictionary, user } = store.getState();
    dictionary.data.forEach(
      (entry) => store.dispatch(removeEntry({ entry, userId: user.details.uid })),
    );
    cy.waitUntil(() => cy.window().its('store').invoke('getState').its('dictionary.data')
      .then((dict) => dict.length === 0));
  });
});

Cypress.Commands.add('addEntry', (entryData) => {
  cy.window().its('store').then((store) => {
    const { user } = store.getState();
    store.dispatch(addEntry({
      entryData,
      userId: user.details.uid,
    }));
  });
});
