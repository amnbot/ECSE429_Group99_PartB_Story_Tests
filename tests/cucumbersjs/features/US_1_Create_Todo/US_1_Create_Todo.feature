Feature: Create a todo
  As a user, I want to create a new todo item so that I can add tasks to my list.

  Background:
    Given the API is running

  # Normal Flow: Successfully create a todo
  Scenario Outline: Successfully create a todo
    When I send a "POST" request to "/todos" with the following data:
      | title | description |
      | test todo | todo for testing |
    Then the response status should be 201
    And the response should contain a valid todo item with a generated id

  # Error Flow: Fail to create a todo without a title
  Scenario: Fail to create a todo without a title
    When I send a "POST" request to "/todos" with the following data:
      | title | doneStatus | description |
      | | false | title is missing |
    Then the response status should be 400
    And the error message should indicate that the title is required

  # Alternate Flow: Create a todo with optional doneStatus
  Scenario: Create a todo with optional doneStatus
    When I send a "POST" request to "/todos" with the following data:
      | title | doneStatus | description |
      | new task | false | new task to be completed |
    Then the response status should be 201
    And the returned todo item should have the title "new task"
