Feature: Delete a todo
  As a user, I want to delete a todo item so that I can remove tasks that are no longer needed.

  Background:
    Given the API is running

  # Normal Flow: Successfully delete an existing todo item.
  Scenario: Successfully delete an existing todo item
    When I send a "DELETE" request to "/todos/1"
    Then the response status should be 200
    When I send a "GET" request to "/todos/1"
    Then the response status should be 404
    And the error message should correspond to:
      """
      {
        "errorMessages": [
          "Could not find an instance with todos/1"
        ]
      }
      """

  # Alternate Flow: Delete a todo item linked to a project
  Scenario: Delete a todo item linked to a project
    When I send a "DELETE" request to "/todos/1"
    Then the response status should be 200
    And the project with id "1" should no longer reference todo "1"
  
  # Error Flow: Fail to delete a non-existent todo item.
  Scenario: Fail to delete a non-existent todo item
    When I send a "DELETE" request to "/todos/999"
    Then the response status should be 404
    And the error message should correspond to:
      """
      {
        "errorMessages": [
          "Could not find any instances with todos/999"
        ]
      }
      """
