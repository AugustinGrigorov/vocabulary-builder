import 'cypress-wait-until';

import {
  addEntry,
} from '../../src/actions';

Cypress.Commands.add('clearAllEntries', () => {
  cy.request('DELETE', 'http://localhost:8080/emulator/v1/projects/vocabulary-builder-7bcdb/databases/(default)/documents');
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
