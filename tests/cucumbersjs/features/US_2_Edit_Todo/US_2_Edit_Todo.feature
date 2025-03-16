Feature: Edit a todo
  As a user, I want to update an existing todo item so that I can correct its details or mark it as complete.

  Background:
    Given the API is running

  # Normal Flow: Successfully update an existing todo
  Scenario: Successfully update an existing todo item
    When I send a "PUT" request to "/todos/1" with the following data:
      | title | doneStatus | description |
      | scan paperwork | true | new description for scan paperwork |
    Then the response status should be 200
    And the returned todo item should have the title "scan paperwork"
    And the returned todo item should have doneStatus "true"
    And the returned todo item should have the description "new description for scan paperwork"

  # Error Flow: Attempt to update a non-existent todo
  Scenario: Fail to update a non-existent todo
    When I send a "PUT" request to "/todos/9999" with the following data:
      | title | doneStatus | description |
      | non-existent todo | false | todo does not exist |
    Then the response status should be 404

  # Alternate Flow: Partial update using POST
  Scenario: Partially update a todo item using POST
    When I send a "POST" request to "/todos/1" with the following data:
      | description | updated description |
    Then the response status should be 200
    And the returned todo item should have the description "updated description"
