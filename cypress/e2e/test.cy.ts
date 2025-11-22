import { TIngredient } from '../../src/utils/types';
import * as orderData from '../fixtures/order.json';

describe('Тест добавления ингредиентов в конструктор', () => {
    beforeEach(() => {
        cy.fixture('ingredients.json').as('ingredientsData');

        cy.intercept('GET', 'api/ingredients', {
            fixture: 'ingredients.json',
        });

        cy.visit('/');

        cy.get('[data-cy="constructor"]').should('exist');
        cy.get('[data-cy^="ingredient-"]').should('have.length.greaterThan', 0);
    });

    test("Добавление булки устанавливает верх и низ", () => {
        cy.get('[data-cy="ingredient-bun"]').find('button').click();

        cy.get('[data-cy="constructor-bun-top"]').should('exist');
        cy.get('[data-cy="constructor-bun-bottom"]').should('exist');
    });

    test("Добавление начинки в конструктор", () => {
        cy.get('[data-cy="ingredient-main"]').find('button').click();

        cy.get('[data-cy="constructor-element"] li').should("have.length", 1); 
    });
})

describe('Тест модалок', () => {
    beforeEach(() => {
        cy.fixture('ingredients.json').as('ingredientsData');
        cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });

        cy.visit('/');

        cy.get('[data-cy^="ingredient-"]').should('have.length.greaterThan', 0);
    })

    test('Открытие модалки', () => {
        cy.get('[data-cy^="ingredient-"]').first().click();
        cy.get('[data-cy="modal"]').should('be.visible');
    })

    test('Закрытие модалки через крестик', () => {
        cy.get('[data-cy^="ingredient-"]').first().click();
        cy.get('[data-cy="modal"]').should('be.visible');

        cy.get('[data-cy="close-button"]').click();
        cy.get('[data-cy="modal"]').should('not.exist');
    })

    test('Закрытие модалки через оверлэй', () => {
        cy.get('[data-cy^="ingredient-"]').first().click();
        cy.get('[data-cy="modal"]').should('be.visible');

        cy.get('[data-cy="overlay"]').click({ force: true });
        cy.get('[data-cy="modal"]').should('not.exist');
    })

    test('Отображает данные ингредиента, по которому кликнули', () => {
        cy.get('[data-cy^="ingredient-"]').first().as('firstIngredient');

        cy.get('@firstIngredient').find('p.text_type_main-default').invoke('text').as('ingredientName');
        cy.get('@firstIngredient').find('img').invoke('attr', 'src').as('ingredientImage');

        cy.get('@firstIngredient').click();

        cy.get('[data-cy="modal"]').should('be.visible');

        cy.get('@ingredientName').then((name) => {
            cy.get('[data-cy="modal"] h3').should('contain.text', name!.toString().trim());
        });

        cy.get('@firstIngredient').find('img').invoke('attr', 'src').then((src) => {
        const baseSrc = src!.replace(/(\.\w+)$/, '');

        cy.get('[data-cy="modal"] img')
            .should('have.attr', 'src')
            .and('match', new RegExp(`^${baseSrc}`));
        });

        cy.get('[data-cy="close-button"]').click();
        cy.get('[data-cy="modal"]').should('not.exist');
    });
})

describe('Создание заказа', () => {
    beforeEach(() => {
        cy.fixture('ingredients.json').as('ingredientsData');
        cy.fixture('user.json').as('userData');
        cy.fixture('order.json').as('orderData');

        cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
        cy.intercept('GET', '/api/auth/user', { fixture: 'user.json' }).as('getUser');
        cy.intercept('POST', '/api/orders', { fixture: 'order.json' }).as('createOrder');

        cy.window().then((window) => {
            window.localStorage.setItem('refreshToken', 'mock-refresh-token');
            document.cookie = 'accessToken=Bearer mock-access-token; path=/; secure; samesite=strict';
        });

        cy.visit('/');
        cy.wait('@getIngredients');
        cy.wait('@getUser');

        cy.get('[data-cy="constructor"]').should('exist');
        cy.get('[data-cy^="ingredient-"]').should('have.length.greaterThan', 0);
    })

    test('Создание заказа', () => {
        cy.get('[data-cy="ingredient-bun"]').find('button').click();
        cy.get('[data-cy="ingredient-main"]').find('button').click();
        cy.get('[data-cy="ingredient-sauce"]').find('button').click();

        cy.get('[data-cy="constructor"]').contains('button', 'Оформить заказ').click();

        cy.get('[data-cy="modal"]').should('be.visible');
        cy.get('[data-cy="order-number"]').should('contain.text', orderData.order.number.toString());

        cy.get('[data-cy="close-button"]').click();

        cy.get('[data-cy="constructor-bun-top"]', {timeout: 5000}).should('not.exist');
        cy.get('[data-cy="constructor-bun-bottom"]').should('not.exist');
        cy.get('[data-cy="constructor-element"] li').should('have.length', 0);
    })

    afterEach(() => {
        cy.clearAllCookies();
        cy.window().then((window) => {
            window.localStorage.removeItem('refreshToken');
        })
    });
});
