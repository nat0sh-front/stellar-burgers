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

    it("Добавление булки устанавливает верх и низ", () => {
        cy.get('[data-cy="ingredient-bun"]')
            .first()
            .within(() => {
                cy.get('[data-cy="ingredient-name"]')
                    .invoke("text")
                    .as("bunName");
            });

        cy.get('[data-cy="constructor-bun-top"]').should("not.exist");
        cy.get('[data-cy="constructor-bun-bottom"]').should("not.exist");

        cy.get('[data-cy="ingredient-bun"]').first().find("button").click();

        cy.get("@bunName").then((name) => {
            cy.get('[data-cy="constructor-bun-top"]').should("contain.text", name);
            cy.get('[data-cy="constructor-bun-bottom"]').should("contain.text", name);
        });
    });

    it("Добавление начинки в конструктор", () => {
        cy.get('[data-cy="ingredient-main"]')
            .first()
            .within(() => {
                cy.get('[data-cy="ingredient-name"]').invoke("text").as("ingredientName");
            });

        cy.get("@ingredientName").then((name) => {
            cy.get('[data-cy="constructor-element"]').should("not.contain.text", name);
        });

        cy.get('[data-cy="ingredient-main"]').first().find("button").click();

        cy.get("@ingredientName").then((name) => {
            cy.get('[data-cy="constructor-element"]').should("contain.text", name);
        });
    });
});

describe('Тест модалок', () => {
    beforeEach(() => {
        cy.fixture('ingredients.json').as('ingredientsData');
        cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });

        cy.visit('/');
        cy.get('[data-cy^="ingredient-"]').should('have.length.greaterThan', 0);
    });

    it('Открытие модалки', () => {
        cy.get('[data-cy^="ingredient-"]').first().click();
        cy.get('[data-cy="modal"]').should('be.visible');
        cy.get('[data-cy="modal"] h3').should('exist');
    });

    it('Закрытие модалки через крестик', () => {
        cy.get('[data-cy^="ingredient-"]').first().click();
        cy.get('[data-cy="modal"]').as('modal');

        cy.get('@modal').should('be.visible');
        cy.get('[data-cy="close-button"]').click();

        cy.get('@modal').should('not.exist');
    });

    it('Закрытие модалки через оверлэй', () => {
        cy.get('[data-cy^="ingredient-"]').first().click();
        cy.get('[data-cy="modal"]').as('modal');

        cy.get('@modal').should('be.visible');
        cy.get('[data-cy="overlay"]').click({ force: true });

        cy.get('@modal').should('not.exist');
    });

    it('Отображает данные выбранного ингредиента', () => {
        cy.get('[data-cy^="ingredient-"]').first().as('firstIngredient');

        cy.get('@firstIngredient').find('[data-cy="ingredient-name"]').invoke('text').as('ingredientName');
        cy.get('@firstIngredient').find('img').invoke('attr', 'src').as('ingredientImage');

        cy.get('@firstIngredient').click();

        cy.get('[data-cy="modal"]').should('be.visible');

        cy.get('@ingredientName').then((name) => {
            cy.get('[data-cy="modal"] h3').should('contain.text', name.toString().trim());
        });

        cy.get('@ingredientImage').then((src) => {
            const baseSrc = src.toString().replace(/(\.\w+)$/, '');
            cy.get('[data-cy="modal"] img')
                .should('have.attr', 'src')
                .and('match', new RegExp(`^${baseSrc}`));
        });

        cy.get('[data-cy="close-button"]').click();
        cy.get('[data-cy="modal"]').should('not.exist');
    });
});


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
    });

    it('Создание заказа', () => {
        cy.get('[data-cy="ingredient-bun"]').first().find('button').click();
        cy.get('[data-cy="ingredient-main"]').first().find('button').click();
        cy.get('[data-cy="ingredient-sauce"]').first().find('button').click();

        cy.get('[data-cy="modal"]').should('not.exist');

        cy.get('[data-cy="constructor"]').contains('button', 'Оформить заказ').click();

        cy.get('[data-cy="modal"]').should('be.visible');

        cy.get('[data-cy="order-number"]').should(
            'contain.text',
            orderData.order.number.toString()
        );

        cy.get('[data-cy="close-button"]').click();

        cy.get('[data-cy="constructor-bun-top"]').should('not.exist');
        cy.get('[data-cy="constructor-bun-bottom"]').should('not.exist');
        cy.get('[data-cy="constructor-element"] li').should('have.length', 0);
    });

    afterEach(() => {
        cy.clearAllCookies();
        cy.window().then((window) => {
            window.localStorage.removeItem('refreshToken');
        });
    });
});
