Feature: PolicyCenter Login
  As a user
  I want to login to PolicyCenter
  So that I can access the system

  Scenario: Successful Login
    Given I am on the PolicyCenter login page
    When I login with username "admin" and password "password"
    Then I should be logged in successfully

  Scenario: Failed Login
    Given I am on the PolicyCenter login page
    When I login with username "invalid_user" and password "wrong_password"
    Then I should see a login error message
