/// <reference types="Cypress" />

import {
    HEADER,
    TODO_INPUT_PLACEHOLDER,
    BUTTON_TEXT,
    LABEL_COLOR
} from '../constants/constants'

import * as toDoPage from '../pages/page_todo'
import * as toDoUtils from '../utils/utils'

describe("todo app", () => {
    beforeEach(() => {
        toDoUtils.interceptGetTodosAPI()

        cy.visit("/")
        
    })
    it("has one header with text Simple ToDo List", () => {
        toDoPage.getHeader().contains(HEADER)
    })

    it('has one input form for adding todo text', () => {
        toDoPage.getTodoTextInputForm()
        .should('have.attr', 'type', 'text')
        .and('have.attr', 'placeholder', TODO_INPUT_PLACEHOLDER)
        .and('have.class', 'text-center')
    })

    it('has one button with text Add', () => {
        toDoPage.getAddButton().contains(BUTTON_TEXT)
    })

    it('check correct number of todos are displayed', () => {
        cy.wait('@getToDosAPI').then(interception => {
            let response = interception.response.body
            return response.length
        }).then(count => {
            toDoPage.getToDoCountLabel()
            .should('have.css', 'background-color', LABEL_COLOR)
            .and('contain', count)
        })
    })
    
})


describe('Add to-dos', () => {
    let todoIDS = []
    
    beforeEach(() => {
        toDoUtils.interceptCreateTodosAPI()
        
        cy.fixture('to-dos').as('testdata')

        cy.visit("/")
    })

    it('adding one or more todos will display the todos and the count of todos', () => {
        cy.get('@testdata').then(testdata => {
            testdata.forEach(toDo => {
                toDoPage.getTodoTextInputForm().clear().type(toDo)

                toDoPage.getAddButton().contains('Add').click()

                cy.wait('@createToDosAPI').then((interception) => {
                    let response = interception.response.body
                    todoIDS.push(response[0]['_id'])
                })

                toDoPage.getToDoTextLabel().contains(toDo)
                
            })

            toDoPage.getToDoCheckbox().then(($list) => {
                let count = $list.length
                toDoPage.getToDoCountLabel().contains(count)
            })
        })
    })

    afterEach(() => {
        todoIDS.forEach((id) => {
            toDoUtils.deleteTodoWithAPI(id)
        })
    })

})

describe('remove to-dos', () => {

    beforeEach(() => {{
        toDoUtils.interceptDeleteTodosAPI()
        
        cy.fixture('to-dos').as('testdata')
        
        cy.get('@testdata').then(testdata => {
            testdata.forEach((toDoText) => {
                toDoUtils.createTodoWithAPI(toDoText)
            })
        })        
        
        cy.visit("/")
    }})

    it('checking on to-do checkboxes remove the to-dos', () => {
        toDoPage.getToDoCheckbox().then(($list) => {
            let temp = $list.length -1
            for(let count = temp; count >= 0; count--){
                toDoPage.getToDoCheckbox().first().check()
                cy.wait('@deleteToDosAPI')
                toDoPage.getToDoCountLabel().contains(count)
            }
        })

    })
})


describe("Visiting any other page returns 404", () => {
    it("Visiting any other page returns 404", () => {
        cy.request({url:'/home', failOnStatusCode: false,})
        .its('status' )
        .should('be.equal', 404)
    })
})