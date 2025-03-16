Feature: Create a New Project
  As a user, I want to create a new project so that I can assign todo items to it.

  Background:
    Given the API is running

  # Normal Flow: Successfully create a project
  Scenario: Successfully create a project
    When I send a "POST" request to "/projects" with the following data:
      | title | description | completed | active |
      | test | test project | false | true |
    Then the response status should be 201
    And the response should contain a valid project with a generated id
    And the returned project should have the title "test"
    And the returned project should have the description "test project"
    And the returned project should have completed "false"
    And the returned project should have active "true"

  # Alternate Flow: Successfully create a new project with only the title provided
  Scenario: Successfully create a new project with only the title provided
    When I send a "POST" request to "/projects" with the following data:
      | title | testing |
    Then the response status should be 201
    And the response should contain a valid project with a generated id
    And the returned project should have the title "testing"
    And the returned project should have the description ""
    And the returned project should have completed "false"
    And the returned project should have active "false"

  # Error Flow: Fail to create a new project with invalid completed field
  Scenario: Fail to create a new project with invalid completed field
    When I send a "POST" request to "/projects" with the following data:
      | title | completed |
      | test project | no |
    Then the response status should be 400
    And the error message should correspond to:
      """
      {
        "errorMessages": [
          "Failed Validation: completed should be BOOLEAN"
        ]
      }
      """
