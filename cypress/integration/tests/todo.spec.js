/// <referrence types="Cypress" />

import {
    HEADER,
    TODO_INPUT_PLACEHOLDER,
    BUTTON_TEXT,
    LABEL_COLOR
} from '../constants/constants'

describe("todo app", () => {
    beforeEach(() => {{
        cy.visit("/")
    }})
    it("has one header with text Simple ToDo List", () => {
        cy.get('h1').contains(HEADER)
    })

    it('has one input form for adding todo text', () => {
        cy.get('.form-control')
        .should('have.attr', 'type', 'text')
        .and('have.attr', 'placeholder', TODO_INPUT_PLACEHOLDER)
        .and('have.class', 'text-center')
    })

    it('has one button with text Add', () => {
        cy.get('button').contains(BUTTON_TEXT)
    })

    it('has one label with 0 when no to do is added', () => {
        cy.get('.label').contains('0')

        cy.get('.label-info')
        .should('have.css', 'background-color', LABEL_COLOR)
    })
    
})


describe('Add to-dos and remove to-dos', () => {
    beforeEach(() => {{
        cy.visit("/")
    }})

    it('adding one or more todos will display the todos and the count of todos', () => {
        cy.fixture('to-dos').then(testdata => {
            let count = testdata.length
            testdata.forEach((toDo, index) => {
                cy.get('.form-control').clear().type(toDo)
                cy.get('.btn').contains('Add').click()

                cy.get('.checkbox').eq(index).contains(toDo)
                
            })
            
            cy.get('.label').contains(count)

        })
    })

    it('checking on to-dos remove the to-dos', () => {
        cy.intercept(
            {
                "method": "DELETE",
            }
        ).as('delete')
        
        cy.get('input[type="checkbox"]').then(($list) => {
            let count = $list.length
            for(let temp = 0; temp < count; temp++){
                cy.get('input[type="checkbox"]').first().check()
                cy.wait('@delete')
            }
        })

        cy.get('.label').contains(0)
    })            
})

describe("Visiting any other page returns 404", () => {

    it("Visiting any other page returns 404", () => {
        cy.request({url:'/home', failOnStatusCode: false,}).its('status' ).should('be.equal', 404)
    })

    
})