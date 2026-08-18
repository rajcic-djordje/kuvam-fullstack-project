# Kuvam – Test Plan

## 1. Purpose

The purpose of this test plan is to verify that the core functionalities of the Kuvam web application work correctly, reliably, and according to predetermined requirements.

Testing will focus primarily on critical user flows, API behavior, authorization rules, data integrity, and important end-to-end scenarios.

## 2. Scope

### In Scope

The following areas will be covered:

* User registration and login
* User profile management
* Seller profile management
* Profile image / logo / banner upload
* Seller offer creation and modification
* Offer browsing and filtering
* Order creation
* Order status changes
* Buyer and seller authorization rules
* API validation and error handling
* Data persistence and database integrity

### Out of Scope

For the initial QA version of the project, the following will not be covered in depth:

* Performance and load testing
* Advanced security penetration testing
* Cross-browser testing across a large number of browsers
* Large-scale concurrency testing
* Mobile application testing

These areas may be added later.


## 3. Test Approach

Testing will combine manual testing with automated API, UI, and database-level verification. The level of automation will depend on the risk, stability, and purpose of each scenario.

### API Testing

REST Assured will be used as the primary automation layer for business rules and authorization scenarios.

API testing will focus on:

- User authentication and protected endpoint access.
- Buyer, seller, and admin role restrictions.
- Seller approval and account status restrictions.
- Resource ownership rules for offers, orders, reviews, and administrative actions.
- Valid and invalid order status transitions.
- Offer creation, modification, activation, and deactivation rules.
- Order creation and quantity validation.
- Inventory updates after order creation, cancellation, or rejection.
- Review eligibility and duplicate review prevention.
- Input validation and malformed request handling.
- Direct API attempts to bypass frontend restrictions.
- HTTP status codes and response body validation.

Most business rules will be covered at the API level because these tests are faster, more isolated, and better suited for validating authorization, negative scenarios, and edge cases than full UI end-to-end tests.

### UI Testing

Selenium WebDriver will be used primarily for critical user journeys and frontend-backend integration.

Automated UI scenarios will focus on flows such as:

- User registration and login.
- Completing and updating buyer or seller profile information.
- Seller creating and managing an offer.
- Buyer browsing offers and creating an order.
- Seller viewing and accepting or rejecting an incoming order.
- Seller marking an accepted order as ready.
- Buyer completing an order after pickup.
- Creating a review after a completed order.
- Uploading and replacing seller logo, cover image, or offer image.
- Verifying that important changes remain visible after page refresh or a new session.

UI automation will not duplicate every API validation scenario. It will mainly verify that the most important business flows work correctly from the user's perspective.

### Database Testing

Database checks will be used for selected high-risk operations where API or UI responses alone are not sufficient to confirm correct system state.

Database verification will focus on:

- Correct buyer and seller ownership of created orders.
- Correct order status persistence after state transitions.
- Offer quantity reduction after order creation.
- Offer quantity restoration after order cancellation or rejection.
- Correct persistence of offer changes.
- Correct association of reviews with the corresponding order, seller, and offer.
- Correct seller rating and review data where applicable.
- User, seller, and account status changes.
- Persistence of profile and image-related data.

Database validation will be used selectively rather than for every automated test.

### Manual Testing

Manual testing will be used where automation provides limited value or where human observation is more appropriate.

Manual testing will focus on:

- Exploratory testing of buyer, seller, and admin workflows.
- New or recently changed functionality before it becomes stable enough for automation.
- Visual and responsive layout issues.
- Usability and clarity of user interactions and error messages.
- Image upload behavior and visual presentation.
- Unusual combinations of actions that may reveal unexpected application behavior.
- Verification of scenarios discovered during exploratory testing before deciding whether they should be added to the automated regression suite.



## 4. Main Risks

Testing will be prioritized based on the potential impact of failures on authorization, order processing, inventory consistency, and core business rules.

### High Risk

#### Authentication, Roles and Account Status
- Buyers, sellers, or unauthenticated users gaining access to operations that are not allowed for their role.
- Suspended or deactivated users retaining access to protected application functionality.
- Pending or rejected sellers being able to create or manage offers before administrator approval.
- Non-admin users gaining access to seller approval, user suspension, or report moderation functionality.

#### Resource Ownership
- A seller being able to update, activate, or deactivate another seller's offer.
- A buyer being able to view, cancel, or complete another buyer's order.
- A seller being able to view or change the status of an order that belongs to another seller.
- Private buyer or seller information being returned to users who are not involved in the corresponding order.

#### Order Lifecycle
- Invalid order status transitions being accepted.
- Buyers cancelling orders after they are no longer pending.
- Sellers accepting or rejecting orders that are no longer pending.
- Sellers marking an order as ready before it has been accepted.
- Buyers completing an order before it has been marked as ready.
- Buyers being able to order their own offers.

#### Inventory and Pricing Integrity
- Orders being created for inactive offers, sold-out offers, or offers belonging to unapproved sellers.
- Requested quantity exceeding the available offer quantity.
- Available quantity not being reduced correctly after an order is created.
- Quantity not being restored correctly after an order is cancelled or rejected.
- Concurrent orders causing the available quantity to become incorrect or negative.
- Order `unitPrice` or `totalPrice` not matching the offer price and ordered quantity at the time the order is created.

### Medium Risk

#### Offer Management
- Invalid offer price, quantity, category, unit, name, or description being accepted.
- Inactive or sold-out offers appearing in public offer listings.
- Offers from pending or rejected sellers appearing publicly.
- Search or category filtering returning incorrect offers.

#### Reviews
- A buyer reviewing an order that has not been completed.
- A buyer reviewing an order that does not belong to them.
- More than one review being created for the same order.
- A review being associated with the wrong seller or offer.
- Seller review count or average rating being calculated incorrectly.

#### Reports and Moderation
- Reports being created with invalid or inconsistent data.
- Already processed reports being incorrectly approved or rejected again.
- Administrative moderation actions affecting the wrong user or seller.
- Seller approval/rejection state not being reflected correctly in available functionality.

#### Input Validation
- Backend validation accepting values that the frontend rejects, or rejecting values that the frontend accepts.
- Invalid Object IDs, malformed requests, boundary values, or missing required fields causing unexpected application behavior.
- Frontend restrictions being bypassed through direct API requests.

#### Image Uploads
- Unsupported image formats or oversized images being accepted.
- Logo, cover, or offer images being associated with the wrong seller or offer.
- Replacing an existing image resulting in incorrect or stale image data.
- Invalid image uploads leaving inconsistent application data.

### Low Risk

Lower-risk issues include problems that do not compromise data or prevent completion of the main buyer/seller flows, such as:

- Minor visual inconsistencies.
- Non-critical responsive layout issues.
- Minor usability problems with a clear workaround.
- Cosmetic issues in offer, profile, or order presentation.

## 5. Test Environment

The initial testing environment will consist of:

* Local Kuvam frontend
* Local backend
* Development/test database
* Chrome browser
* Java automation project
* Maven
* Selenium WebDriver
* REST Assured
* TestNG
* GitHub Actions for automated execution

Sensitive configuration such as credentials and environment-specific values should not be hardcoded into the test code.

## 6. Test Data

Dedicated test users will be used for different roles and scenarios.

Examples:

* Buyer account
* Seller account
* Secondary seller account for authorization tests
* Valid and invalid offer data
* Valid and invalid image files
* Orders in different states

Where possible, automated tests should create or prepare the data they require instead of depending on data created manually by previous tests.

## 7. Entry Criteria

Testing of a functionality can begin when:

* The functionality is implemented.
* Requirements or expected behavior are known.
* The application can be started successfully.
* Required test environment and data are available.

## 8. Exit Criteria

The initial QA cycle can be considered complete when:

* Critical user flows have been tested.
* Critical automated tests pass.
* No known critical defects remain unresolved.
* Major authorization scenarios have been verified.
* Important API and database scenarios have been covered.
* Known remaining issues are documented.

## 9. Test Deliverables

The project will contain:

* Test plan
* Test scenarios / test cases
* Automated API tests
* Automated UI tests
* Database validation tests
* Automated test reports
* CI configuration
* Project README
* Defect reports
