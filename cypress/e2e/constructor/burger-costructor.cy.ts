import {
  TSendOrderResponseData,
  TRefreshTokenResponseData,
  TUserResponseData,
  TAuthResponseData,
} from '../../../src/services/remote-api-service';
import { TUser } from '../../../src/utils/user-types';

const selectors = {
  middlesRoot: '[class*=middle_item_root]',
  ingredientCard: '[class*=burger_ingredient_card]',
  constructor: '[class*=burger_constructor]',
  totalPrice: '[data-cy="total-price"]',
  postOrderNum: '[class*=order_num]',
  modal: '[class*=modal_root]',
  modalCloseButton: '[class*=modal_close]',
  ingredientContainer: '[class*=ingredients_container]',
};

describe('Burger constructor is ok', () => {
  const dropIngredientToConstructor = (ingredientName: string) => {
    cy.window().then((win) => {
      const dataTransfer = new win.DataTransfer();

      cy.contains(selectors.ingredientCard, ingredientName).trigger('dragstart', { dataTransfer });
      cy.get(selectors.constructor).first().trigger('drop', { dataTransfer });
    });
  };

  beforeEach(() => {
    // Stub API calls
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('POST', '**/orders', {
      statusCode: 200,
      body: { success: true, name: 'Test order', order: { number: 424242 } } as TSendOrderResponseData,
    }).as('postOrder');
    cy.intercept('POST', '**/auth/token', {
      statusCode: 200,
      body: { success: true, accessToken: 'token', refreshToken: 'refresh' } as TRefreshTokenResponseData,
    }).as('refreshToken');
    cy.intercept('GET', '**/auth/user', {
      statusCode: 200,
      body: { success: true, user: { name: 'My User', email: 'my@evpronina.ru' } as TUser } as TUserResponseData,
    }).as('getUser');
    cy.intercept('POST', '**/auth/login', {
      statusCode: 200,
      body: {
        success: true,
        user: { name: 'My User', email: 'my@evpronina.ru' },
        accessToken: 'Bearer token',
        refreshToken: 'refresh',
      } as TAuthResponseData,
    }).as('login');

    // Login
    cy.visit('/login');
    cy.get('[name^=email]').type('my@evpronina.ru');
    cy.get('[name^=password]').type('12345678');
    cy.contains('button', 'Войти').click();
    cy.wait('@login');
  });

  it('burger constructor should work', () => {
    cy.visit('/');
    cy.get(selectors.totalPrice).as('totalPrice');

    cy.get('@totalPrice').should('have.text', '0');
    cy.contains('button', 'Оформить заказ').should('be.disabled');

    dropIngredientToConstructor('Булка с кунжутом');
    dropIngredientToConstructor('Котлета из марсианской говядины');

    cy.contains(selectors.middlesRoot, 'Булка с кунжутом (верх)').should('exist');
    cy.contains(selectors.middlesRoot, 'Булка с кунжутом (низ)').should('exist');
    cy.contains(selectors.middlesRoot, 'Котлета из марсианской говядины').should('exist');

    cy.get('@totalPrice').should('have.text', '270');
    cy.contains('button', 'Оформить заказ').should('not.be.disabled').click();

    cy.wait('@postOrder');
    cy.contains(selectors.postOrderNum, '424242').should('be.visible');
  });

  it('ingredients popups should work', () => {
    cy.visit('/');

    cy.get(selectors.ingredientCard).first().click();

    cy.get(selectors.modal).should('be.visible');
    cy.get(selectors.ingredientContainer).should('be.visible');

    cy.get(selectors.modalCloseButton).click();
    cy.get(selectors.modal).should('not.exist');
    cy.get(selectors.ingredientContainer).should('not.exist');
  });
});
