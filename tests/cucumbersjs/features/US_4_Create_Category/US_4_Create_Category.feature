Feature: Create a New Category
  As a user, I want to create a new category so that I can assign todo items to it.

  Background:
    Given the API is running

  # Normal Flow: Successfully create a category
  Scenario: Successfully create a category
    When I send a "POST" request to "/categories" with the following data:
      | title | description |
      | test | test category |
    Then the response status should be 201
    And the returned category should have a generated id
    And the returned category should have the title "test"
    And the returned category should have the description "test category"

  # Alternate Flow: Successfully create a category with only mandatory title field
  Scenario: Successfully create a category with only mandatory title field
    When I send a "POST" request to "/categories" with the following data:
      | title | Personal |
    Then the response status should be 201
    And the returned category should have a generated id
    And the returned category should have the title "Personal"
    And the returned category should have the description ""

  # Error Flow: Fail to create a new category when the title is missing
  Scenario: Fail to create a category without a title
    When I send a "POST" request to "/categories" with the following data:
      | title | description |
      | | title is missing |
    Then the response status should be 400
    And the error message should indicate that the title is required
