/// <reference types="Cypress" />

export function interceptGetTodosAPI(){
    cy.intercept(
        {
            "method": "GET",
            "hostname": Cypress.config('host'),
            "path": "/api/todos"
        }
    ).as('getToDosAPI')
}

export function interceptCreateTodosAPI(){
    cy.intercept(
        {
            "method": "POST",
            "hostname": Cypress.config('host'),
            "path": "/api/todos"
        }
    ).as('createToDosAPI')
}


export function interceptDeleteTodosAPI(){
    cy.intercept("DELETE","/api/todos/**").as('deleteToDosAPI')
}