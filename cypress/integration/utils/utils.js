/// <reference types="Cypress" />

export function interceptGetTodosAPI(){
    cy.intercept("GET", "/api/todos", req => {
            delete req.headers['if-none-match']
        }).as('getToDosAPI')
}

export function interceptCreateTodosAPI(){
    cy.intercept("POST", "/api/todos").as('createToDosAPI')
}


export function interceptDeleteTodosAPI(){
    cy.intercept("DELETE","/api/todos/**").as('deleteToDosAPI')
}

export function createTodoWithAPI(todoText){

    cy.request("POST", "/api/todos", {text: todoText}).its('status' ).should('be.equal', 200)
}

export function getTodoWithAPI(){

    cy.request("GET", "/api/todos").its('status' ).should('be.equal', 200)
}



export function deleteTodoWithAPI(todoID){
    cy.request("DELETE", `/api/todos/${todoID}`).its('status' ).should('be.equal', 200)
}