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

export function getToDoCheckboxes(){
    return cy.get('input[type="checkbox"]')
}

export function getToDoTextLabels(){
    return cy.get('.checkbox')
}