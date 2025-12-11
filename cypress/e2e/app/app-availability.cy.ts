const url = 'localhost:5173';

describe('App is available', function () {
  it(`should be available on ${url}`, function () {
    cy.visit(`http://${url}`);
  });
});

export {};
