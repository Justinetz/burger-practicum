/// <reference types="cypress" />

import type { TAuthResponseData } from '../../src/services/remote-api-service';

declare global {
  namespace Cypress {
    interface Chainable {
      login(email?: string, password?: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add('login', (email: string = 'my@evpronina.ru', password: string = '12345678') => {
  cy.visit('/login');
  cy.get('[name^=email]').type(email);
  cy.get('[name^=password]').type(password);
  cy.contains('button', 'Войти').click();
  
  // Wait for login to complete
  cy.url().should('not.include', '/login');
});
