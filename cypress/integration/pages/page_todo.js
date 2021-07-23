/// <reference types="Cypress" />

export function getHeader(){
    return cy.get('h1')
}

export function getTodoTextInputForm(){
    return cy.get('.form-control')
}

export function getAddButton(){
    return cy.get('button')
}

export function getToDoCountLabel(){
    return cy.get('.label-info')
}

export function getToDoCheckbox(){
    return cy.get('input[type="checkbox"]')
}

export function getToDoTextLabel(){
    return cy.get('.checkbox')
}