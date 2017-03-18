@javascript
Feature: Home page
  Background:
    Given A signed up user

  Scenario: Home page loaded successfully
    When I go to home page
    Then I can see the home page with options
