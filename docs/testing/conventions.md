# Playwright Coding Conventions

## Purpose

This document defines the coding conventions and architectural principles used throughout the Playwright test suite.

The objective is to ensure that all automated tests are:

* readable
* maintainable
* reusable
* independent
* easy to extend

These conventions should be followed whenever a new test or supporting component is added.

---

# General Principles

## Business before implementation

Tests should describe **business behaviour**, not technical implementation.

Good example:

```text
Administrator deletes a user.
```

Poor example:

```text
Click delete button and verify CSS selector.
```

The test should explain **what** is being verified.

The Page Object should implement **how** it is done.

---

## One responsibility per component

Every component has exactly one responsibility.

| Component   | Responsibility            |
| ----------- | ------------------------- |
| Test        | Business workflow         |
| Page Object | UI interaction            |
| Fixture     | Test setup                |
| Test Data   | Input data                |
| Helper      | Generic utility functions |

---

## Independent tests

Every test must be executable independently.

A test must never depend on another test being executed first.

---

# Folder Structure

```text
tests/

├── e2e/
├── pages/
├── fixtures/
├── helpers/
├── test-data/
└── resources/
```

Future business-oriented folders may be introduced as the project grows.

---

# Naming Conventions

## Test files

Pattern

```text
feature.spec.ts
```

Examples

```text
login.spec.ts

delete-user.spec.ts

create-task.spec.ts
```

---

## Page Objects

Pattern

```text
<Name>Page.ts
```

Examples

```text
LoginPage.ts

DashboardPage.ts

UsersPage.ts

TasksPage.ts
```

---

## Methods

Method names should always describe an action.

Pattern

```text
verb + object
```

Examples

```ts
loginLikeHuman()

deleteUser()

createTask()

assignTask()

logout()
```

Avoid generic names such as:

```ts
run()

execute()

clickButton()
```

---

## Test names

Test titles should describe the expected business behaviour.

Example

```ts
test("Administrator can delete a user")
```

Avoid technical descriptions such as

```ts
test("Click delete button")
```

---

# Page Object Rules

Page Objects contain:

* locators
* UI interactions
* reusable assertions

Page Objects do **not** contain:

* business decisions
* test data
* hardcoded credentials

---

# Locators

Preferred locator priority:

1. getByRole()
2. getByLabel()
3. getByPlaceholder()
4. getByText()
5. locator()

Avoid CSS selectors whenever possible.

Good

```ts
page.getByRole("button", { name: "Login" })
```

Avoid

```ts
page.locator(".btn-primary")
```

---

# Assertions

Assertions should verify business outcomes.

Good

```ts
await expect(page.getByRole("heading", {
    name: "My Tasks"
})).toBeVisible();
```

Later, reusable assertions should be moved into Page Objects.

Example

```ts
dashboardPage.expectDashboardVisible();
```

---

# Test Data

Credentials and configurable values must never be hardcoded inside tests.

Future versions will use environment variables and centralized test-data files.

Example

```ts
users.admin.email

users.admin.password
```

---

# Helpers

Helpers contain generic utility functions only.

Examples

* random strings
* dates
* screenshots
* waits

Helpers must never contain business workflows.

---

# Logging

Temporary console logging may be added during debugging.

Before committing:

* remove debugging logs
* remove temporary waits
* remove experimental code

Only meaningful logging should remain.

---

# Comments

Code should be self-explanatory.

Comments should explain **why**, not **what**.

Good

```ts
// Login is performed using keyboard navigation
// to simulate real user behaviour.
```

Avoid

```ts
// Click login button
```

---

# Future Extensions

The test suite will gradually be extended with:

* API Tests
* Accessibility Tests
* Responsive Tests
* Performance Tests
* Cross Browser Tests
* CI/CD Integration
* Visual Regression Tests

These conventions may evolve together with the project.
