/// <referrence types="Cypress" />

import {
    HEADER,
    TODO_INPUT_PLACEHOLDER,
    BUTTON_TEXT,
    LABEL_COLOR
} from '../constants/constants'

describe("todo app", () => {
    beforeEach(() => {
        cy.intercept(
            {
                "method": "GET",
            }
        ).as('get')
        
        cy.visit("/")
        
    })
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

    it('check correct number of todos are displayed', () => {
        cy.wait('@get')
        cy.get('.label-info')
        .should('have.css', 'background-color', LABEL_COLOR)
        .then( () => {
            let el = Cypress.$("input:checkbox")
            let count = el.length
            cy.get('.label').contains(count)
        })

    })
    
})


describe('Add to-dos and remove to-dos', () => {
    beforeEach(() => {{
        cy.intercept(
            {
                "method": "DELETE",
            }
        ).as('delete')
        
        cy.fixture('to-dos').as('testdata')

        cy.visit("/")
    }})

    it('adding one or more todos will display the todos and the count of todos', () => {
        cy.get('@testdata').then(testdata => {
            testdata.forEach((toDo) => {
                cy.get('.form-control').clear().type(toDo)
                cy.get('.btn').contains('Add').click()

                cy.get('.checkbox').contains(toDo)
                
            })

            cy.get('input[type="checkbox"]').then(($list) => {
                let count = $list.length
                cy.get('.label').contains(count)
            })
        })
    })

    it('checking on to-dos remove the to-dos', () => {
        cy.get('input[type="checkbox"]').then(($list) => {
            let temp = $list.length -1
            for(let count = temp; count >= 0; count--){
                cy.get('input[type="checkbox"]').first().check()
                cy.wait('@delete')
                cy.get('.label').contains(count)
            }
        })

    })            
})

describe("Visiting any other page returns 404", () => {
    it("Visiting any other page returns 404", () => {
        cy.request({url:'/home', failOnStatusCode: false,}).its('status' ).should('be.equal', 404)
    })
})