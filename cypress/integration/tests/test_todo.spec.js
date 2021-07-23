/// <reference types="Cypress" />

import * as constants from '../constants/constants'
import * as toDoPage from '../pages/page_todo'
import * as toDoUtils from '../utils/utils'

describe("todo app", () => {
    beforeEach(() => {
        toDoUtils.interceptGetTodosAPI()
        cy.visit("/")
        
    })
    it("has one header with text Simple ToDo List", () => {
        toDoPage.getHeader().contains(constants.HEADER_TEXT)
    })

    it('has one input form for adding todo text', () => {
        toDoPage.getTodoTextInputForm()
        .should('have.attr', 'type', 'text')
        .and('have.attr', 'placeholder', constants.TODO_INPUT_PLACEHOLDER_TEXT)
        .and('have.class', 'text-center')
    })

    it('has one button with text Add', () => {
        toDoPage.getAddButton().contains(constants.BUTTON_TEXT)
    })

    it('check correct number of todos are displayed', () => {
        cy.wait('@getToDosAPI').then(interception => {
            let response = interception.response.body
            return response.length
        }).then(count => {
            toDoPage.getToDoCountLabel()
            .should('have.css', 'background-color', constants.LABEL_COLOR)
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

                toDoPage.getAddButton().contains(constants.BUTTON_TEXT).click()

                cy.wait('@createToDosAPI').then((interception) => {
                    let response = interception.response.body
                    todoIDS.push(response[0]['_id'])
                })

                toDoPage.getToDoTextLabels().contains(toDo)
                
            })

            toDoPage.getToDoCheckboxes().then(($list) => {
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
        toDoPage.getToDoTextLabels().then(($list) => {
            let temp = $list.length -1
            for(let count = temp; count >= 0; count--){
                toDoPage.getToDoCheckboxes().first().check()
                cy.wait('@deleteToDosAPI').then(interception => {
                    let response = interception.response
                    expect(response.statusCode).to.equal(200)
                })
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