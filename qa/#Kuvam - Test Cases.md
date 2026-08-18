# Kuvam – Test Cases

This document defines concrete test cases for each scenario provided in Test Scenarios.

## 1. Authentication and Account Access

### Scenario: AUTH-01 – Successful user login with valid credentials

### TC-AUTH-001 – UI - Successful user login with valid credentials

**Preconditions:**
    - User has an active account in the Kuvam application.

**Test data:**
    - Valid registered user email.
    - Corresponding valid password.

**Steps:**
    1. Open the application in a browser.
    2. Navigate to the Login page (`/login`).
    3. Enter the email in the email input field.
    4. Enter the password in the password input field.
    5. Click the Login button.

**Expected result:**
    - Login is successful.
    - User is redirected to the Home page.
    - User session is established.
    - User has access to authenticated-only functionality.

### TC-AUTH-002 – API - Successful user login with valid credentials

**Preconditions:**
    - User has an active account in the Kuvam application.

**Test data:**
    - Valid registered user email.
    - Corresponding valid password.

**Steps:**
    1. Create a `POST` request to `/api/v1/auth/login`.
    2. Set the request body content type to JSON.
    3. Insert the user's email into the `email` field and password into the `password` field.
    4. Send the request.

**Expected result:**
    - Server returns HTTP status `200`.
    - Response body contains the expected user information.
    - Response body contains a valid access token.

---

### Scenario: AUTH-02 – Unsuccessful user login with invalid credentials

### TC-AUTH-003 – UI - Unsuccessful user login to a non-existing user account

**Preconditions:**
    - No user account exists with the provided email.

**Test data:**
    - Email not tied to an existing Kuvam user account.
    - Any password with at least 8 characters.

**Steps:**
    1. Open the application in a browser.
    2. Navigate to the Login page (`/login`).
    3. Enter the email in the email input field.
    4. Enter the password in the password input field.
    5. Click the Login button.

**Expected result:**
    - Login is unsuccessful.
    - User remains on the Login page.
    - User session is not established.
    - A toast informs the user that login was unsuccessful because of invalid credentials.

### TC-AUTH-004 – UI - Unsuccessful user login with invalid password

**Preconditions:**
    - User has an active account in the Kuvam application.

**Test data:**
    - Valid registered user email.
    - Any incorrect password with at least 8 characters.

**Steps:**
    1. Open the application in a browser.
    2. Navigate to the Login page (`/login`).
    3. Enter the email in the email input field.
    4. Enter the password in the password input field.
    5. Click the Login button.

**Expected result:**
    - Login is unsuccessful.
    - User remains on the Login page.
    - User session is not established.
    - A toast informs the user that login was unsuccessful because of invalid credentials.

### TC-AUTH-005 – UI - Unsuccessful user login with empty fields

**Preconditions:**
    - None.

**Test data:**
    - Empty email and/or password field.

**Steps:**
    1. Open the application in a browser.
    2. Navigate to the Login page (`/login`).
    3. Leave the email field empty, the password field empty, or both fields empty.
    4. Click the Login button.

**Expected result:**
    - Login is unsuccessful.
    - User remains on the Login page.
    - User session is not established.
    - The page informs the user that required login fields are missing.

### TC-AUTH-006 – UI - Unsuccessful user login with malformed email

**Preconditions:**
    - None.

**Test data:**
    - Invalidly formatted email address.
    - Any password with at least 8 characters.

**Steps:**
    1. Open the application in a browser.
    2. Navigate to the Login page (`/login`).
    3. Enter the malformed email into the email input field.
    4. Enter the password into the password input field.
    5. Click the Login button.

**Expected result:**
    - Login is unsuccessful.
    - User remains on the Login page.
    - User session is not established.
    - A toast informs the user that one or more input fields contain invalid data.

### TC-AUTH-007 – API - Unsuccessful user login to a non-existing user account

**Preconditions:**
    - No user account exists with the provided email.

**Test data:**
    - Validly formatted email address not tied to an existing Kuvam user account.
    - Any password with at least 8 characters.

**Steps:**
    1. Create a `POST` request to `/api/v1/auth/login`.
    2. Set the request body content type to JSON.
    3. Insert the email into the `email` field and password into the `password` field.
    4. Send the request.

**Expected result:**
    - Server returns HTTP status `401`.
    - Response body contains error code `INVALID_CREDENTIALS`.
    - Response body contains message `Invalid email or password`.

### TC-AUTH-008 – API - Unsuccessful user login with invalid password

**Preconditions:**
    - User has an active account in the Kuvam application.

**Test data:**
    - Valid registered user email.
    - Any incorrect password with at least 8 characters.

**Steps:**
    1. Create a `POST` request to `/api/v1/auth/login`.
    2. Set the request body content type to JSON.
    3. Insert the registered email into the `email` field and the incorrect password into the `password` field.
    4. Send the request.

**Expected result:**
    - Server returns HTTP status `401`.
    - Response body contains error code `INVALID_CREDENTIALS`.
    - Response body contains message `Invalid email or password`.

### TC-AUTH-009 – API - Unsuccessful user login with malformed email

**Preconditions:**
    - None.

**Test data:**
    - Invalidly formatted email address.
    - Any password with at least 8 characters.

**Steps:**
    1. Create a `POST` request to `/api/v1/auth/login`.
    2. Set the request body content type to JSON.
    3. Insert the malformed email into the `email` field and the password into the `password` field.
    4. Send the request.

**Expected result:**
    - Server returns HTTP status `400`.
    - Response body contains error code `VALIDATION_ERROR`.
    - Response body contains message `Invalid request data`.

### TC-AUTH-010 – API - Unsuccessful user login with empty required fields

**Preconditions:**
    - None.

**Test data:**
    - Empty `email` field, empty `password` field, or both fields empty.

**Steps:**
    1. Create a `POST` request to `/api/v1/auth/login`.
    2. Set the request body content type to JSON.
    3. Leave the `email` field empty, the `password` field empty, or both fields empty.
    4. Send the request.

**Expected result:**
    - Server returns HTTP status `400`.
    - Response body contains error code `VALIDATION_ERROR`.
    - Response body contains message `Invalid request data`.

---

### Scenario: AUTH-03 – Successful user registration with valid user data

### TC-AUTH-011 – UI - Successful user registration with valid user data

**Preconditions:**
    - None.

**Test data:**
    - Validly formatted first name.
    - Validly formatted last name.
    - Validly formatted email address not tied to an existing account.
    - Valid password.
    - Matching password confirmation.
    - Selected valid user role.
    - For seller registration: valid household/business name and valid short description.

**Steps:**
    1. Open the application in a browser.
    2. Navigate to the Register page (`/register`).
    3. Select the desired user role.
    4. If registering as a buyer:
       - Enter first name.
       - Enter last name.
       - Enter email address.
       - Enter password.
       - Enter matching password confirmation.
    5. If registering as a seller:
       - Enter first name.
       - Enter last name.
       - Enter email address.
       - Enter password.
       - Enter matching password confirmation.
       - Enter a valid household/business name.
       - Enter a valid short description.
    6. Click the Register button.

**Expected result:**
    - Registration is successful.
    - User is redirected to the Login page.
    - The email field on the Login page is prefilled with the registered email address.

### TC-AUTH-012 – API - Successful user registration with valid user data

**Preconditions:**
    - No user account exists with the provided email.

**Test data:**
    - Valid `firstName`.
    - Valid `lastName`.
    - Validly formatted email address not tied to an existing account.
    - Valid password.
    - Valid user `role`.
    - For seller registration: valid `businessName` and `description`.

**Steps:**
    1. Create a `POST` request to `/api/v1/auth/register`.
    2. Set the request body content type to JSON.
    3. Insert valid `firstName`, `lastName`, `email`, `password`, and `role` fields into the request body.
    4. If registering a seller, also insert valid `businessName` and `description` fields.
    5. Send the request.

**Expected result:**
    - Server returns HTTP status `201`.
    - Response body contains the created user's information.

### TC-AUTH-013 – UI - Unsuccessful user registration with already registered email

**Preconditions:**
    - An existing Kuvam user account is already registered with the provided email address.

**Test data:**
    - Validly formatted first name.
    - Validly formatted last name.
    - Email address already tied to an existing Kuvam user account.
    - Valid password.
    - Matching password confirmation.
    - Selected valid user role.
    - For seller registration: valid household/business name and valid short description.

**Steps:**
    1. Open the application in a browser.
    2. Navigate to the Register page (`/register`).
    3. Select the desired user role.
    4. Enter valid registration data.
    5. Enter an email address that is already registered in the Kuvam application.
    6. If registering as a seller, enter a valid household/business name and short description.
    7. Click the Register button.

**Expected result:**
    - Registration is unsuccessful.
    - User remains on the Register page.
    - A toast informs the user that an account with the provided email already exists.

### TC-AUTH-014 – API - Unsuccessful user registration with already registered email

**Preconditions:**
    - An existing Kuvam user account is already registered with the provided email address.

**Test data:**
    - Valid `firstName`.
    - Valid `lastName`.
    - Email address already tied to an existing Kuvam user account.
    - Valid password.
    - Valid user `role`.
    - For seller registration: valid `businessName` and `description`.

**Steps:**
    1. Create a `POST` request to `/api/v1/auth/register`.
    2. Set the request body content type to JSON.
    3. Insert valid registration data into the request body.
    4. Use an email address that is already registered in the Kuvam application.
    5. If registering a seller, also include valid `businessName` and `description` fields.
    6. Send the request.

**Expected result:**
    - Server returns HTTP status `409`.
    - Response body contains error code `EMAIL_ALREADY_IN_USE`.
    - Response body contains message `User already registered.`.

### TC-AUTH-015 – UI - Unsuccessful user registration with missing required field

**Preconditions:**
    - None.

**Test data:**
    - Valid registration data with at least one required field left empty.

**Steps:**
    1. Open the application in a browser.
    2. Navigate to the Register page (`/register`).
    3. Select the desired user role.
    4. Enter valid registration data into the available fields.
    5. Leave at least one required field empty.
    6. Click the Register button.

**Expected result:**
    - Registration is unsuccessful.
    - User remains on the Register page.
    - A toast informs the user to verify that all required fields are filled in.

### TC-AUTH-016 – API - Unsuccessful user registration with missing required field

**Preconditions:**
    - None.

**Test data:**
    - Valid registration payload with at least one required field missing or empty.

**Steps:**
    1. Create a `POST` request to `/api/v1/auth/register`.
    2. Set the request body content type to JSON.
    3. Insert otherwise valid registration data into the request body.
    4. Omit or leave empty at least one required field.
    5. Send the request.

**Expected result:**
    - Server returns HTTP status `400`.
    - Response body contains error code `VALIDATION_ERROR`.
    - Response body contains message `Invalid request data.`.

### TC-AUTH-017 – UI - Unsuccessful user registration with malformed email

**Preconditions:**
    - None.

**Test data:**
    - Otherwise valid registration data.
    - Invalidly formatted email address.

**Steps:**
    1. Open the application in a browser.
    2. Navigate to the Register page (`/register`).
    3. Select the desired user role.
    4. Enter valid registration data into all required fields.
    5. Enter a malformed email address into the email input field.
    6. If registering as a seller, enter a valid household/business name and short description.
    7. Click the Register button.

**Expected result:**
    - Registration is unsuccessful.
    - User remains on the Register page.
    - A toast informs the user to verify the entered registration data.

### TC-AUTH-018 – API - Unsuccessful user registration with malformed email

**Preconditions:**
    - None.

**Test data:**
    - Otherwise valid registration payload.
    - Invalidly formatted email address.

**Steps:**
    1. Create a `POST` request to `/api/v1/auth/register`.
    2. Set the request body content type to JSON.
    3. Insert otherwise valid registration data into the request body.
    4. Insert a malformed email address into the `email` field.
    5. If registering a seller, also include valid `businessName` and `description` fields.
    6. Send the request.

**Expected result:**
    - Server returns HTTP status `400`.
    - Response body contains error code `VALIDATION_ERROR`.
    - Response body contains message `Invalid request data.`.

### TC-AUTH-019 – UI - Unsuccessful seller registration with missing seller-specific fields

**Preconditions:**
    - None.

**Test data:**
    - Valid seller registration data with `businessName`, `description`, or both seller-specific fields left empty.

**Steps:**
    1. Open the application in a browser.
    2. Navigate to the Register page (`/register`).
    3. Select the seller role.
    4. Enter valid first name, last name, email address, password, and matching password confirmation.
    5. Leave the household/business name, short description, or both seller-specific fields empty.
    6. Click the Register button.

**Expected result:**
    - Registration is unsuccessful.
    - User remains on the Register page.
    - A toast informs the user to verify that all required fields are filled in.

### TC-AUTH-020 – API - Unsuccessful seller registration with missing seller-specific fields

**Preconditions:**
    - None.

**Test data:**
    - Otherwise valid seller registration payload with `businessName`, `description`, or both seller-specific fields missing or empty.

**Steps:**
    1. Create a `POST` request to `/api/v1/auth/register`.
    2. Set the request body content type to JSON.
    3. Insert valid seller registration data into the request body.
    4. Omit or leave empty the `businessName`, `description`, or both seller-specific fields.
    5. Send the request.

**Expected result:**
    - Server returns HTTP status `400`.
    - Response body contains error code `VALIDATION_ERROR`.
    - Response body contains message `Invalid request data.`.

### TC-AUTH-021 – UI - Unsuccessful user registration with non-matching passwords

**Preconditions:**
    - None.

**Test data:**
    - Otherwise valid registration data.
    - Valid password.
    - Password confirmation that does not match the entered password.

**Steps:**
    1. Open the application in a browser.
    2. Navigate to the Register page (`/register`).
    3. Select the desired user role.
    4. Enter valid registration data into all required fields.
    5. Enter a valid password.
    6. Enter a different value into the password confirmation field.
    7. If registering as a seller, enter a valid household/business name and short description.
    8. Click the Register button.

**Expected result:**
    - Registration is unsuccessful.
    - User remains on the Register page.
    - A toast informs the user to verify the entered registration fields.

---

### Scenario: AUTH-05 – Unsuccessful user login to a deactivated account

### TC-AUTH-022 – UI - Unsuccessful user login to a deactivated account

**Preconditions:**
    - A registered Kuvam user account exists and is deactivated.

**Test data:**
    - Valid email address of the deactivated user account.
    - Correct password for the deactivated user account.

**Steps:**
    1. Open the application in a browser.
    2. Navigate to the Login page (`/login`).
    3. Enter the email address of the deactivated account.
    4. Enter the correct password.
    5. Click the Login button.

**Expected result:**
    - Login is unsuccessful.
    - User remains on the Login page.
    - User session is not established.
    - A toast informs the user that the account is currently inactive.

### TC-AUTH-023 – API - Unsuccessful user login to a deactivated account

**Preconditions:**
    - A registered Kuvam user account exists and is deactivated.

**Test data:**
    - Valid email address of the deactivated user account.
    - Correct password for the deactivated user account.

**Steps:**
    1. Create a `POST` request to `/api/v1/auth/login`.
    2. Set the request body content type to JSON.
    3. Insert the deactivated account email into the `email` field and the correct password into the `password` field.
    4. Send the request.

**Expected result:**
    - Server returns HTTP status `403`.
    - Response body contains error code `ACCOUNT_DEACTIVATED`.
    - Response body contains message `Account deactivated.`.

---

### Scenario: AUTH-06 – Unsuccessful user login to a suspended account

### TC-AUTH-024 – UI - Unsuccessful user login to a suspended account

**Preconditions:**
    - A registered Kuvam user account exists and is suspended.
    - A suspension reason is stored for the suspended account.

**Test data:**
    - Valid email address of the suspended user account.
    - Correct password for the suspended user account.

**Steps:**
    1. Open the application in a browser.
    2. Navigate to the Login page (`/login`).
    3. Enter the email address of the suspended account.
    4. Enter the correct password.
    5. Click the Login button.

**Expected result:**
    - Login is unsuccessful.
    - User remains on the Login page.
    - User session is not established.
    - A toast informs the user that the account is suspended.
    - The toast displays the reason for the account suspension.

### TC-AUTH-025 – API - Unsuccessful user login to a suspended account

**Preconditions:**
    - A registered Kuvam user account exists and is suspended.
    - A suspension reason is stored for the suspended account.

**Test data:**
    - Valid email address of the suspended user account.
    - Correct password for the suspended user account.

**Steps:**
    1. Create a `POST` request to `/api/v1/auth/login`.
    2. Set the request body content type to JSON.
    3. Insert the suspended account email into the `email` field and the correct password into the `password` field.
    4. Send the request.

**Expected result:**
    - Server returns HTTP status `403`.
    - Response body contains error code `ACCOUNT_SUSPENDED`.
    - Response body contains a message indicating that the account is suspended.
    - Response body message contains the stored suspension reason.

---

### Scenario: AUTH-07 – Successful user login to an account after removal of a suspension

### TC-AUTH-026 – UI - Successful user login after account suspension is removed

**Preconditions:**
    - A registered Kuvam user account exists and is suspended.
    - An authenticated admin removes the suspension from the account through the Admin Suspensions page using the `Ukini suspenziju` action and confirmation modal.

**Test data:**
    - Valid email address of the previously suspended user account.
    - Correct password for the previously suspended user account.

**Steps:**
    1. Open the application in a browser.
    2. Navigate to the Login page (`/login`).
    3. Enter the email address of the account whose suspension has been removed.
    4. Enter the correct password.
    5. Click the Login button.

**Expected result:**
    - Login is successful.
    - User is redirected to the Home page.
    - User session is established.
    - User has access to authenticated-only functionality.

### TC-AUTH-027 – API - Successful user login after account suspension is removed

**Preconditions:**
    - A registered Kuvam user account exists and is suspended.
    - An authenticated admin removes the suspension by sending a `PATCH` request to `/api/v1/admin/users/{userId}/unsuspend`.

**Test data:**
    - Valid email address of the previously suspended user account.
    - Correct password for the previously suspended user account.
    - Valid user ID of the suspended account for the setup request.
    - Valid admin authentication token for the setup request.

**Steps:**
    1. Ensure the suspension removal setup request to `/api/v1/admin/users/{userId}/unsuspend` succeeds.
    2. Create a `POST` request to `/api/v1/auth/login`.
    3. Set the request body content type to JSON.
    4. Insert the previously suspended account email into the `email` field and the correct password into the `password` field.
    5. Send the request.

**Expected result:**
    - Server returns HTTP status `200`.
    - Response body contains the expected user information.
    - Response body contains a valid access token.

---

### Scenario: AUTH-08 – Successful user login after account password change

### TC-AUTH-028 – UI - Successful user login after account password change

**Preconditions:**
    - A registered active Kuvam user account exists.
    - The user successfully changes their account password through the Profile page.
    - The user is logged out after the password change.

**Test data:**
    - Valid registered user email.
    - Newly changed valid password.

**Steps:**
    1. Open the application in a browser.
    2. Navigate to the Login page (`/login`).
    3. Enter the registered user email.
    4. Enter the newly changed password.
    5. Click the Login button.

**Expected result:**
    - Login is successful.
    - User is redirected to the Home page.
    - User session is established.
    - User has access to authenticated-only functionality.

### TC-AUTH-029 – API - Successful user login after account password change

**Preconditions:**
    - A registered active Kuvam user account exists.
    - The account password has been successfully changed through the appropriate authenticated password-change functionality.

**Test data:**
    - Valid registered user email.
    - Newly changed valid password.

**Steps:**
    1. Create a `POST` request to `/api/v1/auth/login`.
    2. Set the request body content type to JSON.
    3. Insert the registered user email into the `email` field and the newly changed password into the `password` field.
    4. Send the request.

**Expected result:**
    - Server returns HTTP status `200`.
    - Response body contains the expected user information.
    - Response body contains a valid access token.

---

### Scenario: AUTH-11 – Unsuccessful user login with old password after password change

### TC-AUTH-030 – UI - Unsuccessful user login with old password after password change

**Preconditions:**
    - A registered active Kuvam user account exists.
    - The user has successfully changed the account password.
    - The old password is no longer valid for the account.

**Test data:**
    - Valid registered user email.
    - Previous account password.

**Steps:**
    1. Open the application in a browser.
    2. Navigate to the Login page (`/login`).
    3. Enter the registered user email.
    4. Enter the old password that was valid before the password change.
    5. Click the Login button.

**Expected result:**
    - Login is unsuccessful.
    - User remains on the Login page.
    - User session is not established.
    - A toast informs the user that the credentials are invalid.

### TC-AUTH-031 – API - Unsuccessful user login with old password after password change

**Preconditions:**
    - A registered active Kuvam user account exists.
    - The user has successfully changed the account password.
    - The old password is no longer valid for the account.

**Test data:**
    - Valid registered user email.
    - Previous account password.

**Steps:**
    1. Create a `POST` request to `/api/v1/auth/login`.
    2. Set the request body content type to JSON.
    3. Insert the registered user email into the `email` field and the old password into the `password` field.
    4. Send the request.

**Expected result:**
    - Server returns HTTP status `401`.
    - Response body contains error code `INVALID_CREDENTIALS`.
    - Response body contains message `Invalid email or password`.

---

### Scenario: AUTH-09 – Site access restrictions for unauthenticated users

### TC-AUTH-032 – UI - Unauthenticated user cannot access protected application pages

**Preconditions:**
    - User is not authenticated.

**Test data:**
    - Protected application route, for example `/profile` or another authenticated-only page.

**Steps:**
    1. Open the application in a browser.
    2. Ensure no authenticated user session is active.
    3. Navigate directly to a protected application route.
    4. Attempt to access the protected page.

**Expected result:**
    - Protected page is not displayed.
    - User is redirected to the Login page.
    - No authenticated user session is established.

### TC-AUTH-033 – API - Unauthenticated user cannot access protected endpoint

**Preconditions:**
    - User is not authenticated.
    - No valid access token is available.

**Test data:**
    - Any backend endpoint that requires authentication.

**Steps:**
    1. Create a request to a protected backend endpoint.
    2. Do not provide a valid access token in the request.
    3. Send the request.

**Expected result:**
    - Server returns HTTP status `401`.
    - Response body contains error code `INVALID_ACCESS_TOKEN`.
    - Response body contains message `Invalid or expired access token.`.
    - Protected data or action is not returned or executed.

---

### Scenario: AUTH-10 – Successful logout from authenticated session

### TC-AUTH-034 – UI - Successful logout from authenticated session

**Preconditions:**
    - A buyer or seller is authenticated in the Kuvam application.

**Test data:**
    - Valid authenticated buyer or seller session.

**Steps:**
    1. Open the authenticated application.
    2. Open the user profile dropdown in the navigation bar.
    3. Click the `Odjava` action.

**Expected result:**
    - Logout is completed.
    - User is redirected to the Home page.
    - Authenticated user state is cleared.
    - Notifications stored in the active client state are cleared.
    - Cart contents stored in the active client state are cleared.
    - Protected pages can no longer be accessed as an authenticated user.

### TC-AUTH-035 – API - Successful logout from authenticated session

**Preconditions:**
    - A valid user session exists.
    - The session has a valid refresh token cookie.

**Test data:**
    - Valid refresh token cookie belonging to the authenticated session.

**Steps:**
    1. Create a `POST` request to `/api/v1/auth/logout`.
    2. Include the valid refresh token cookie.
    3. Send the request.

**Expected result:**
    - Server returns HTTP status `200`.
    - Response body contains message `User logged out successfully.`.
    - Refresh session is revoked.
    - Refresh token cookie is cleared.

---

# Authorization and Resource Ownership

### Scenario: AUTHZ-01 – Buyer or seller cannot access admin-only functionality

### TC-AUTHZ-001 – UI - Non-admin user cannot access admin area

**Preconditions:**
    - A buyer or seller is authenticated.

**Test data:**
    - Authenticated buyer account.
    - Authenticated seller account.
    - Admin-only route such as `/admin/dashboard`.

**Steps:**
    1. Log in as a buyer or seller.
    2. Navigate directly to `/admin/dashboard`.

**Expected result:**
    - Admin dashboard is not displayed.
    - User is redirected to the Home page.

### TC-AUTHZ-002 – API - Non-admin user cannot access admin-only endpoint

**Preconditions:**
    - A buyer or seller is authenticated and has a valid access token.

**Test data:**
    - Valid buyer or seller access token.
    - Admin-only endpoint `GET /api/v1/admin/users`.

**Steps:**
    1. Create a `GET` request to `/api/v1/admin/users`.
    2. Provide a valid buyer or seller access token.
    3. Send the request.

**Expected result:**
    - Server returns HTTP status `403`.
    - Response body contains error code `FORBIDDEN`.
    - Response body contains message `You do not have permission to perform this action.`.
    - Admin-only data is not returned.

### Scenario: AUTHZ-02 – Admin can access admin-only functionality

### TC-AUTHZ-003 – UI - Admin can access admin dashboard

**Preconditions:**
    - An admin is authenticated through the admin authentication flow.

**Test data:**
    - Valid authenticated admin session.

**Steps:**
    1. Navigate to `/admin/dashboard`.

**Expected result:**
    - Admin dashboard is displayed.
    - Admin remains in the admin area.

### TC-AUTHZ-004 – API - Admin can access admin-only endpoint

**Preconditions:**
    - An admin is authenticated and has a valid access token.

**Test data:**
    - Valid admin access token.

**Steps:**
    1. Create a `GET` request to `/api/v1/admin/users`.
    2. Provide the valid admin access token.
    3. Send the request.

**Expected result:**
    - Server returns a successful response.
    - User account data available to the admin is returned.
    - Request is not rejected by role authorization.

### Scenario: AUTHZ-03 – Buyer cannot create or manage seller offers

### TC-AUTHZ-005 – UI - Buyer cannot access seller offer management pages

**Preconditions:**
    - A buyer is authenticated.

**Test data:**
    - Seller-only route such as `/seller/offers/new`.

**Steps:**
    1. Log in as a buyer.
    2. Navigate directly to `/seller/offers/new`.

**Expected result:**
    - Seller offer creation page is not displayed.
    - Buyer is redirected to the Home page.

### TC-AUTHZ-006 – API - Buyer cannot create seller offer

**Preconditions:**
    - A buyer is authenticated and has a valid access token.

**Test data:**
    - Valid buyer access token.
    - Otherwise valid offer creation payload.

**Steps:**
    1. Create a `POST` request to `/api/v1/offers`.
    2. Provide the buyer access token.
    3. Add an otherwise valid offer payload.
    4. Send the request.

**Expected result:**
    - Server returns HTTP status `403`.
    - Response body contains error code `FORBIDDEN`.
    - Response body contains message `You do not have permission to perform this action.`.
    - Offer is not created.

### Scenario: AUTHZ-04 – Seller cannot use buyer-only order functionality

### TC-AUTHZ-007 – UI - Seller cannot access buyer orders page

**Preconditions:**
    - A seller is authenticated.

**Test data:**
    - Buyer-only route `/orders`.

**Steps:**
    1. Log in as a seller.
    2. Navigate directly to `/orders`.

**Expected result:**
    - Buyer orders page is not displayed.
    - Seller is redirected to the Home page.

### TC-AUTHZ-008 – API - Seller cannot access buyer order endpoints

**Preconditions:**
    - A seller is authenticated and has a valid access token.

**Test data:**
    - Valid seller access token.
    - Buyer-only endpoint `GET /api/v1/orders/mine`.

**Steps:**
    1. Create a `GET` request to `/api/v1/orders/mine`.
    2. Provide the seller access token.
    3. Send the request.

**Expected result:**
    - Server returns HTTP status `403`.
    - Response body contains error code `FORBIDDEN`.
    - Response body contains message `You do not have permission to perform this action.`.
    - Buyer order data is not returned.

### Scenario: AUTHZ-05 – Admin cannot use buyer or seller functionality

### TC-AUTHZ-009 – UI - Admin is redirected away from buyer and seller pages

**Preconditions:**
    - An admin is authenticated.

**Test data:**
    - Buyer route `/orders`.
    - Seller route `/seller/offers`.

**Steps:**
    1. Navigate directly to `/orders`.
    2. Verify the resulting navigation.
    3. Navigate directly to `/seller/offers`.
    4. Verify the resulting navigation.

**Expected result:**
    - Buyer and seller pages are not displayed.
    - Admin is redirected to `/admin/dashboard`.

### TC-AUTHZ-010 – API - Admin cannot access buyer or seller role-restricted endpoint

**Preconditions:**
    - An admin is authenticated and has a valid access token.

**Test data:**
    - Valid admin access token.
    - Buyer-only endpoint `GET /api/v1/orders/mine`.
    - Seller-only endpoint `GET /api/v1/offers/mine`.

**Steps:**
    1. Send an authenticated request to `GET /api/v1/orders/mine` using the admin access token.
    2. Send an authenticated request to `GET /api/v1/offers/mine` using the admin access token.

**Expected result:**
    - Both requests return HTTP status `403`.
    - Response body contains error code `FORBIDDEN`.
    - Response body contains message `You do not have permission to perform this action.`.
    - Buyer or seller protected data is not returned.

### Scenario: AUTHZ-06 – Buyer cannot access another buyer's order

### TC-AUTHZ-011 – API - Buyer cannot access another buyer's order

**Preconditions:**
    - Buyer A and Buyer B exist and are authenticated users.
    - Buyer B has an existing order.
    - Buyer A has a valid access token.

**Test data:**
    - Buyer A access token.
    - Valid order ID belonging to Buyer B.

**Steps:**
    1. Create a `GET` request to `/api/v1/orders/mine/{orderId}` using Buyer B's order ID.
    2. Provide Buyer A's access token.
    3. Send the request.

**Expected result:**
    - Server returns HTTP status `404`.
    - Response body contains error code `ORDER_NOT_FOUND`.
    - Response body contains message `Order not found.`.
    - Buyer B's order data is not disclosed to Buyer A.

### Scenario: AUTHZ-07 – Seller cannot manage another seller's offer

### TC-AUTHZ-012 – API - Seller cannot modify another seller's offer

**Preconditions:**
    - Seller A and Seller B exist.
    - Seller B owns an existing offer.
    - Seller A is authenticated and has a valid access token.

**Test data:**
    - Seller A access token.
    - Valid offer ID belonging to Seller B.
    - Valid offer update payload.

**Steps:**
    1. Create a `PATCH` request to `/api/v1/offers/{offerId}` using Seller B's offer ID.
    2. Provide Seller A's access token.
    3. Add a valid update payload.
    4. Send the request.

**Expected result:**
    - Server returns HTTP status `403`.
    - Response body contains error code `OFFER_ACCESS_DENIED`.
    - Response body contains message `You cannot modify another seller's offer.`.
    - Seller B's offer is not modified.

### Scenario: AUTHZ-08 – Seller cannot access another seller's received order

### TC-AUTHZ-013 – API - Seller cannot access another seller's received order

**Preconditions:**
    - Seller A and Seller B exist.
    - An existing order belongs to Seller B.
    - Seller A is authenticated and has a valid access token.

**Test data:**
    - Seller A access token.
    - Valid order ID belonging to Seller B.

**Steps:**
    1. Create a `GET` request to `/api/v1/orders/received/{orderId}` using Seller B's order ID.
    2. Provide Seller A's access token.
    3. Send the request.

**Expected result:**
    - Server returns HTTP status `404`.
    - Response body contains error code `ORDER_NOT_FOUND`.
    - Response body contains message `Order not found.`.
    - Seller B's received order data is not disclosed to Seller A.

### Scenario: AUTHZ-09 – User profile operations are scoped to the authenticated user

### TC-AUTHZ-014 – API - Authenticated user profile update is self-scoped

**Preconditions:**
    - An active buyer or seller is authenticated and has a valid access token.

**Test data:**
    - Valid user access token.
    - Valid profile update payload.

**Steps:**
    1. Create a `PATCH` request to `/api/v1/users/me`.
    2. Provide the authenticated user's access token.
    3. Add a valid profile update payload.
    4. Send the request.

**Expected result:**
    - Update applies to the authenticated user's own account.
    - The profile API does not accept another user ID as the target of the operation.
    - No other user's profile is modified.

### Scenario: AUTHZ-10 – Buyer can access own orders

### TC-AUTHZ-015 – API - Buyer can access own orders

**Preconditions:**
    - A buyer is authenticated and has at least one existing order.

**Test data:**
    - Valid buyer access token.

**Steps:**
    1. Create a `GET` request to `/api/v1/orders/mine`.
    2. Provide the buyer access token.
    3. Send the request.

**Expected result:**
    - Server returns a successful response.
    - Returned orders belong to the authenticated buyer.
    - Orders belonging to other buyers are not included.

### Scenario: AUTHZ-11 – Seller can access and manage own offers

### TC-AUTHZ-016 – API - Seller can access own offers

**Preconditions:**
    - A seller is authenticated and owns at least one offer.

**Test data:**
    - Valid seller access token.

**Steps:**
    1. Create a `GET` request to `/api/v1/offers/mine`.
    2. Provide the seller access token.
    3. Send the request.

**Expected result:**
    - Server returns a successful response.
    - Returned offers belong to the authenticated seller.
    - Offers belonging to other sellers are not included.

### Scenario: AUTHZ-12 – Seller can access orders received for own seller profile

### TC-AUTHZ-017 – API - Seller can access own received orders

**Preconditions:**
    - A seller is authenticated.
    - At least one order exists for that seller.

**Test data:**
    - Valid seller access token.

**Steps:**
    1. Create a `GET` request to `/api/v1/orders/received`.
    2. Provide the seller access token.
    3. Send the request.

**Expected result:**
    - Server returns a successful response.
    - Returned orders are associated with the authenticated seller.
    - Orders belonging to other sellers are not included.

### TC-AUTHZ-018 – UI - Buyer can open their own orders

**Preconditions:**
    - Buyer is logged in.
    - Buyer has at least one existing order.

**Steps:**
    1. Open `/orders`.
    2. Open one of the buyer's orders.

**Expected result:**
    - Buyer's orders page is displayed.
    - Only orders belonging to the logged-in buyer are shown.
    - Buyer can open the detail page for their own order.

### TC-AUTHZ-019 – UI - Seller can open and manage their own offers

**Preconditions:**
    - Seller is logged in.
    - Seller owns at least one offer.

**Steps:**
    1. Open `/seller/offers`.
    2. Open the edit page for one of the seller's offers.

**Expected result:**
    - Seller's offer list is displayed.
    - Seller can open and manage their own offer.

### TC-AUTHZ-020 – UI - Seller can open their own received orders

**Preconditions:**
    - Seller is logged in.
    - Seller has at least one received order.

**Steps:**
    1. Open `/seller/orders`.
    2. Open one of the seller's received orders.

**Expected result:**
    - Seller's received orders page is displayed.
    - Only orders related to the logged-in seller are shown.
    - Seller can open the detail page for their own received order.

### TC-AUTHZ-021 – UI - Buyer cannot open another buyer's order by changing the URL

**Preconditions:**
    - Buyer A is logged in.
    - Buyer B owns an existing order.
    - Buyer A knows Buyer B's order ID.

**Steps:**
    1. Navigate directly to `/orders/{orderId}` using Buyer B's order ID.

**Expected result:**
    - Buyer B's order data is not displayed to Buyer A.
    - UI handles the failed order lookup without exposing protected order information.

### TC-AUTHZ-022 – UI - Seller cannot edit another seller's offer by changing the URL

**Preconditions:**
    - Seller A is logged in.
    - Seller B owns an existing offer.
    - Seller A knows Seller B's offer ID.

**Steps:**
    1. Navigate directly to `/seller/offers/{offerId}/edit` using Seller B's offer ID.

**Expected result:**
    - Seller B's offer cannot be edited by Seller A.
    - Protected offer data is not exposed as an editable seller-owned resource.

### TC-AUTHZ-023 – UI - Seller cannot open another seller's received order by changing the URL

**Preconditions:**
    - Seller A is logged in.
    - Seller B has an existing received order.
    - Seller A knows the order ID.

**Steps:**
    1. Navigate directly to `/seller/orders/{orderId}` using Seller B's order ID.

**Expected result:**
    - Seller B's order data is not displayed to Seller A.
    - UI handles the failed order lookup without exposing protected order information.

---

# Seller Approval and Account Status

### Scenario: STATUS-01 – Pending seller cannot use approval-dependent seller functionality

### TC-STATUS-001 – API - Pending seller cannot create offer

**Preconditions:**
    - A registered seller account exists.
    - The seller profile has approval status `pending`.
    - The seller account is active.
    - The seller is authenticated and has a valid access token.

**Test data:**
    - Valid pending seller access token.
    - Otherwise valid offer creation payload.

**Steps:**
    1. Create a `POST` request to `/api/v1/offers`.
    2. Provide the pending seller access token.
    3. Add an otherwise valid offer payload.
    4. Send the request.

**Expected result:**
    - Server returns HTTP status `403`.
    - Response body contains error code `SELLER_NOT_APPROVED`.
    - Response body contains message `Seller account is not approved.`.
    - Offer is not created.

### Scenario: STATUS-02 – Rejected seller cannot use approval-dependent seller functionality

### TC-STATUS-002 – API - Rejected seller cannot create offer

**Preconditions:**
    - A registered seller account exists.
    - The seller profile has approval status `rejected`.
    - The seller account is active.
    - The seller is authenticated and has a valid access token.

**Test data:**
    - Valid rejected seller access token.
    - Otherwise valid offer creation payload.

**Steps:**
    1. Create a `POST` request to `/api/v1/offers`.
    2. Provide the rejected seller access token.
    3. Add an otherwise valid offer payload.
    4. Send the request.

**Expected result:**
    - Server returns HTTP status `403`.
    - Response body contains error code `SELLER_NOT_APPROVED`.
    - Response body contains message `Seller account is not approved.`.
    - Offer is not created.

### Scenario: STATUS-03 – Approved seller can use approval-dependent seller functionality

### TC-STATUS-003 – API - Approved seller can create offer

**Preconditions:**
    - A registered seller account exists.
    - The seller profile has approval status `approved`.
    - The seller account is active.
    - The seller is authenticated and has a valid access token.

**Test data:**
    - Valid approved seller access token.
    - Valid offer creation payload.

**Steps:**
    1. Create a `POST` request to `/api/v1/offers`.
    2. Provide the approved seller access token.
    3. Add a valid offer payload.
    4. Send the request.

**Expected result:**
    - Server returns HTTP status `201`.
    - Response body contains message `Offer created successfully.`.
    - Response body contains the created offer.
    - Offer is persisted for the authenticated seller.

### Scenario: STATUS-04 – Suspended user cannot use protected functionality

### TC-STATUS-004 – API - Suspended user cannot access protected endpoint

**Preconditions:**
    - A registered buyer or seller account exists.
    - The account is suspended.
    - An access token issued for the account is used to attempt a protected request.

**Test data:**
    - Access token belonging to the suspended account.
    - Protected endpoint appropriate for the user's role.

**Steps:**
    1. Create a request to a protected backend endpoint.
    2. Provide the suspended user's access token.
    3. Send the request.

**Expected result:**
    - Server returns HTTP status `403`.
    - Response body contains error code `ACCOUNT_SUSPENDED`.
    - Response body contains message `Account suspended.`.
    - Protected data or action is not returned or executed.

### Scenario: STATUS-05 – User access is restored after suspension removal

### TC-STATUS-005 – API - Previously suspended user can access protected endpoint after unsuspension

**Preconditions:**
    - A registered buyer or seller account was suspended.
    - An authenticated admin successfully removes the suspension through `PATCH /api/v1/admin/users/{userId}/unsuspend`.
    - The user authenticates again and obtains a new valid access token.

**Test data:**
    - New valid access token belonging to the unsuspended user.
    - Protected endpoint appropriate for the user's role.

**Steps:**
    1. Create a request to a protected backend endpoint appropriate for the user's role.
    2. Provide the newly issued access token.
    3. Send the request.

**Expected result:**
    - Request is not rejected with `ACCOUNT_SUSPENDED`.
    - User can again access functionality allowed for their role.
    - Protected operation returns its normal successful response.

### Scenario: STATUS-06 – Suspended seller's offers are unavailable to buyers and public users

### TC-STATUS-006 – API - Suspended seller's offers are not returned as available public offers

**Preconditions:**
    - An approved seller has at least one active offer with available quantity greater than zero.
    - The seller's user account is suspended.

**Test data:**
    - Existing active offer belonging to the suspended seller.

**Steps:**
    1. Create a `GET` request to `/api/v1/offers`.
    2. Send the request.
    3. Inspect the returned available offers.

**Expected result:**
    - Server returns HTTP status `200`.
    - Offers belonging to the suspended seller are not returned as available offers.
    - Buyers and unauthenticated users cannot discover the suspended seller's offer through the public offer listing.

### Scenario: STATUS-07 – Admin can approve a pending seller

### TC-STATUS-007 – UI - Admin successfully approves pending seller application

**Preconditions:**
    - An admin is authenticated.
    - At least one active seller application has approval status `pending`.

**Test data:**
    - Existing pending seller application.

**Steps:**
    1. Navigate to `/admin/pending-sellers`.
    2. Locate the pending seller application.
    3. Open the approval action for the application.
    4. Confirm the approval.

**Expected result:**
    - Seller application is approved successfully.
    - The processed seller is removed from the pending sellers list.
    - Seller is no longer treated as a pending application.

### TC-STATUS-008 – API - Admin successfully approves pending seller application

**Preconditions:**
    - An admin is authenticated and has a valid access token.
    - An active seller application exists with approval status `pending`.

**Test data:**
    - Valid admin access token.
    - Valid seller ID belonging to the pending application.

**Steps:**
    1. Create a `PATCH` request to `/api/v1/admin/sellers/{sellerId}/approve`.
    2. Provide the admin access token.
    3. Send the request.

**Expected result:**
    - Server returns HTTP status `200`.
    - Response body contains message `Seller application approved successfully.`.
    - Returned seller has approval status `approved`.
    - Rejection reason is cleared.

### Scenario: STATUS-08 – Admin can reject a pending seller

### TC-STATUS-009 – UI - Admin successfully rejects pending seller application

**Preconditions:**
    - An admin is authenticated.
    - At least one active seller application has approval status `pending`.

**Test data:**
    - Existing pending seller application.
    - Valid rejection reason.

**Steps:**
    1. Navigate to `/admin/pending-sellers`.
    2. Locate the pending seller application.
    3. Open the rejection action.
    4. Enter a valid rejection reason.
    5. Confirm the rejection.

**Expected result:**
    - Seller application is rejected successfully.
    - The processed seller is removed from the pending sellers list.
    - Rejection reason is stored for the rejected application.

### TC-STATUS-010 – API - Admin successfully rejects pending seller application

**Preconditions:**
    - An admin is authenticated and has a valid access token.
    - An active seller application exists with approval status `pending`.

**Test data:**
    - Valid admin access token.
    - Valid seller ID belonging to the pending application.
    - Rejection reason containing between 3 and 500 characters.

**Steps:**
    1. Create a `PATCH` request to `/api/v1/admin/sellers/{sellerId}/reject`.
    2. Provide the admin access token.
    3. Add a JSON body containing a valid `reason`.
    4. Send the request.

**Expected result:**
    - Server returns HTTP status `200`.
    - Response body contains message `Seller application rejected successfully.`.
    - Returned seller has approval status `rejected`.
    - Returned seller contains the supplied rejection reason.

### Scenario: STATUS-09 – Admin cannot process a seller application that is no longer pending

### TC-STATUS-011 – API - Admin cannot approve or reject an already processed seller application

**Preconditions:**
    - An admin is authenticated and has a valid access token.
    - A seller application already has approval status `approved` or `rejected`.

**Test data:**
    - Valid admin access token.
    - Seller ID belonging to an already processed application.
    - Valid rejection reason for the reject request variant.

**Steps:**
    1. Send `PATCH /api/v1/admin/sellers/{sellerId}/approve` for the already processed application.
    2. Verify the response.
    3. Send `PATCH /api/v1/admin/sellers/{sellerId}/reject` for an already processed application using a valid rejection reason.
    4. Verify the response.

**Expected result:**
    - Each attempted reprocessing request returns HTTP status `409`.
    - Response body contains error code `SELLER_APPLICATION_ALREADY_PROCESSED`.
    - Response body contains message `Seller application already processed.`.
    - Existing approval status is not changed.

### TC-STATUS-012 – UI - Pending seller cannot create an offer

**Preconditions:**
    - A seller account exists with approval status `pending`.
    - Seller is logged in.

**Test data:**
    - Valid offer data.

**Steps:**
    1. Open the seller offer creation page.
    2. Enter valid offer data.
    3. Try to create the offer.

**Expected result:**
    - Offer is not created.
    - Seller remains unable to use approval-dependent offer creation.
    - UI shows the error returned for a seller whose account is not approved.

### TC-STATUS-013 – UI - Rejected seller cannot create an offer

**Preconditions:**
    - A seller account exists with approval status `rejected`.
    - Seller is logged in.

**Test data:**
    - Valid offer data.

**Steps:**
    1. Open the seller offer creation page.
    2. Enter valid offer data.
    3. Try to create the offer.

**Expected result:**
    - Offer is not created.
    - Seller remains unable to use approval-dependent offer creation.
    - UI shows the error returned for a seller whose account is not approved.

### TC-STATUS-014 – UI - Suspended seller is not shown as available to buyers

**Preconditions:**
    - An approved seller has at least one active offer with available quantity.
    - The seller account is suspended.

**Steps:**
    1. Open the public offers page as a buyer or unauthenticated user.
    2. Search for the suspended seller or one of their offers.

**Expected result:**
    - Suspended seller is not shown as available.
    - Their offers cannot be opened as available offers.

### TC-STATUS-015 – UI - Suspended user cannot continue using protected functionality

**Preconditions:**
    - Buyer or seller has an authenticated session.
    - Admin suspends that account.

**Steps:**
    1. Keep the suspended user's existing session open.
    2. Try to load or perform an authenticated action.

**Expected result:**
    - Protected action does not succeed.
    - Suspended user cannot continue using protected functionality with the existing session.
    - UI displays the backend suspension error or otherwise prevents the action.

### TC-STATUS-016 – UI - User can use protected functionality after suspension is removed

**Preconditions:**
    - User account was suspended.
    - Admin removes the suspension.
    - User logs in again.

**Steps:**
    1. Open a protected page allowed for the user's role.
    2. Perform a normal authenticated action.

**Expected result:**
    - Protected page and allowed functionality work normally again.
    - User is no longer blocked because of the previous suspension.

### TC-STATUS-017 – UI - Already processed seller application cannot be processed again

**Preconditions:**
    - Admin is logged in.
    - Seller application has already been approved or rejected.

**Steps:**
    1. Open the pending seller applications page.
    2. Look for the already processed application.

**Expected result:**
    - Processed application is no longer available as a pending application.
    - Admin cannot approve or reject the same application again through the UI.

---

# Offer Management

### Scenario: OFFER-01 – Seller can create own offer

### TC-OFFER-001 – UI - Approved seller successfully creates offer

**Preconditions:**
    - An approved seller is authenticated.
    - Seller has access to the seller offer management area.

**Test data:**
    - Valid offer name between 2 and 100 characters.
    - Valid description between 10 and 1000 characters.
    - Valid category.
    - Price greater than or equal to 1.
    - Available quantity greater than or equal to 1.
    - Valid unit.

**Steps:**
    1. Navigate to `/seller/offers/new`.
    2. Enter valid data into all required offer fields.
    3. Submit the offer form.

**Expected result:**
    - Offer is created successfully.
    - Seller is redirected to `/seller/offers`.
    - Newly created offer appears in the seller's offer list.

### TC-OFFER-002 – API - Approved seller successfully creates offer

**Preconditions:**
    - An approved seller is authenticated and has a valid access token.

**Test data:**
    - Valid offer payload containing `name`, `category`, positive `price`, integer `availableQuantity` greater than or equal to 0, and valid `unit`.
    - Optional valid `description`.

**Steps:**
    1. Create a `POST` request to `/api/v1/offers`.
    2. Provide the approved seller access token.
    3. Add a valid JSON offer payload.
    4. Send the request.

**Expected result:**
    - Server returns HTTP status `201`.
    - Response body contains message `Offer created successfully.`.
    - Response body contains the created offer.
    - Created offer belongs to the authenticated seller.

### Scenario: OFFER-02 – Seller can delete own offer

### TC-OFFER-003 – UI - Seller successfully deletes own offer without existing orders

**Preconditions:**
    - An approved seller is authenticated.
    - Seller owns an existing offer.
    - The offer has no existing orders.

**Test data:**
    - Existing seller-owned offer without orders.

**Steps:**
    1. Navigate to `/seller/offers`.
    2. Locate the offer.
    3. Click the delete action.
    4. Confirm the browser confirmation dialog.

**Expected result:**
    - Offer is deleted successfully.
    - Deleted offer is removed from the seller's offer list.
    - A success toast displays `Ponuda je obrisana.`.

### TC-OFFER-004 – API - Seller successfully deletes own offer without existing orders

**Preconditions:**
    - An approved seller is authenticated and has a valid access token.
    - Seller owns an existing offer.
    - The offer has no existing orders.

**Test data:**
    - Valid seller access token.
    - Valid seller-owned offer ID without orders.

**Steps:**
    1. Create a `DELETE` request to `/api/v1/offers/{offerId}`.
    2. Provide the seller access token.
    3. Send the request.

**Expected result:**
    - Server returns HTTP status `200`.
    - Response body contains message `Offer deleted successfully.`.
    - Offer no longer exists.

### TC-OFFER-005 – UI - Seller cannot delete own offer with existing orders

**Preconditions:**
    - An approved seller is authenticated.
    - Seller owns an offer that has at least one existing order.

**Test data:**
    - Existing seller-owned offer referenced by an order.

**Steps:**
    1. Navigate to `/seller/offers`.
    2. Locate the offer.
    3. Click the delete action.
    4. Confirm the browser confirmation dialog.

**Expected result:**
    - Offer is not deleted.
    - Offer remains in the seller's offer list.
    - An error toast informs the seller that an offer with orders cannot be deleted and can only be deactivated.

### TC-OFFER-006 – API - Seller cannot delete own offer with existing orders

**Preconditions:**
    - An approved seller is authenticated and has a valid access token.
    - Seller owns an offer referenced by at least one order.

**Test data:**
    - Valid seller access token.
    - Valid seller-owned offer ID with existing order history.

**Steps:**
    1. Create a `DELETE` request to `/api/v1/offers/{offerId}`.
    2. Provide the seller access token.
    3. Send the request.

**Expected result:**
    - Server returns HTTP status `409`.
    - Response body contains error code `OFFER_HAS_ORDERS`.
    - Response body contains message `Offer with existing orders cannot be deleted.`.
    - Offer is not deleted.

### Scenario: OFFER-03 – Seller can make own offer unavailable

### TC-OFFER-007 – UI - Seller successfully deactivates own offer

**Preconditions:**
    - An approved seller is authenticated.
    - Seller owns an active offer.

**Test data:**
    - Existing active seller-owned offer.

**Steps:**
    1. Navigate to `/seller/offers`.
    2. Locate the active offer.
    3. Click the deactivate action.

**Expected result:**
    - Offer becomes inactive.
    - Offer status is updated in the seller offer list.
    - A success toast displays `Ponuda je deaktivirana.`.
    - Offer is no longer available through the public offer listing.

### TC-OFFER-008 – API - Seller successfully deactivates own offer

**Preconditions:**
    - An approved seller is authenticated and has a valid access token.
    - Seller owns an active offer.

**Test data:**
    - Valid seller access token.
    - Valid seller-owned active offer ID.

**Steps:**
    1. Create a `PATCH` request to `/api/v1/offers/{offerId}/deactivate`.
    2. Provide the seller access token.
    3. Send the request.

**Expected result:**
    - Server returns HTTP status `200`.
    - Response body contains message `Offer deactivated successfully.`.
    - Returned offer has `isActive` set to `false`.

### Scenario: OFFER-04 – Seller can modify own offer information

### TC-OFFER-009 – UI - Seller successfully updates own offer

**Preconditions:**
    - An approved seller is authenticated.
    - Seller owns an existing offer.

**Test data:**
    - Valid updated offer data accepted by the edit form.

**Steps:**
    1. Navigate to `/seller/offers/{offerId}/edit` for a seller-owned offer.
    2. Modify one or more offer fields.
    3. Save the changes.

**Expected result:**
    - Offer information is updated successfully.
    - Seller is redirected to `/seller/offers`.
    - Updated values are displayed for the offer.

### TC-OFFER-010 – API - Seller successfully updates own offer

**Preconditions:**
    - An approved seller is authenticated and has a valid access token.
    - Seller owns an existing offer.

**Test data:**
    - Valid seller access token.
    - Valid seller-owned offer ID.
    - Valid update payload containing at least one editable offer field.

**Steps:**
    1. Create a `PATCH` request to `/api/v1/offers/{offerId}`.
    2. Provide the seller access token.
    3. Add a valid JSON update payload.
    4. Send the request.

**Expected result:**
    - Server returns HTTP status `200`.
    - Response body contains message `Offer updated successfully.`.
    - Response body contains the updated offer.
    - Submitted changes are persisted.

### Scenario: OFFER-06 – Seller cannot create offer with invalid data

### TC-OFFER-011 – UI - Seller cannot create offer with invalid form data

**Preconditions:**
    - An approved seller is authenticated.

**Test data:**
    - Invalid offer data, using one or more variants such as:
      - name shorter than 2 or longer than 100 characters;
      - description shorter than 10 or longer than 1000 characters;
      - missing category;
      - price lower than 1;
      - available quantity lower than 1;
      - missing unit.

**Steps:**
    1. Navigate to `/seller/offers/new`.
    2. Enter one of the invalid data variants.
    3. Attempt to submit the form.

**Expected result:**
    - Offer is not created.
    - User remains on the create offer page.
    - Invalid form fields are marked and their validation feedback is displayed.
    - No successful creation navigation occurs.

### TC-OFFER-012 – API - Seller cannot create offer with invalid payload

**Preconditions:**
    - An approved seller is authenticated and has a valid access token.

**Test data:**
    - Invalid payload using one or more backend-validation variants such as:
      - `name` shorter than 2 or longer than 100 characters;
      - unsupported `category`;
      - non-positive `price`;
      - negative or non-integer `availableQuantity`;
      - missing or invalid `unit`.

**Steps:**
    1. Create a `POST` request to `/api/v1/offers`.
    2. Provide the seller access token.
    3. Add an invalid JSON offer payload.
    4. Send the request.

**Expected result:**
    - Server returns HTTP status `400`.
    - Response body contains error code `VALIDATION_ERROR`.
    - Response body contains message `Invalid request data.`.
    - Offer is not created.

### Scenario: OFFER-07 – Seller cannot update offer with invalid data

### TC-OFFER-013 – UI - Seller cannot update own offer with invalid form data

**Preconditions:**
    - An approved seller is authenticated.
    - Seller owns an existing offer.

**Test data:**
    - Invalid updated offer data, using applicable edit-form validation variants.

**Steps:**
    1. Navigate to `/seller/offers/{offerId}/edit`.
    2. Replace one or more values with invalid data.
    3. Attempt to save the changes.

**Expected result:**
    - Update is not submitted successfully.
    - User remains on the edit offer page.
    - Invalid form fields are marked and validation feedback is displayed.
    - Existing persisted offer data is not replaced by the invalid values.

### TC-OFFER-014 – API - Seller cannot update own offer with invalid payload

**Preconditions:**
    - An approved seller is authenticated and has a valid access token.
    - Seller owns an existing offer.

**Test data:**
    - Valid seller-owned offer ID.
    - Invalid update payload, including an empty payload or one or more values that violate offer validation rules.

**Steps:**
    1. Create a `PATCH` request to `/api/v1/offers/{offerId}`.
    2. Provide the seller access token.
    3. Add the invalid JSON update payload.
    4. Send the request.

**Expected result:**
    - Server returns HTTP status `400`.
    - Response body contains error code `VALIDATION_ERROR`.
    - Response body contains message `Invalid request data.`.
    - Existing offer data is not modified.

### Scenario: OFFER-08 – Seller can reactivate own inactive offer

### TC-OFFER-015 – UI - Seller successfully reactivates own inactive offer

**Preconditions:**
    - An approved seller is authenticated.
    - Seller owns an inactive offer.

**Test data:**
    - Existing inactive seller-owned offer.

**Steps:**
    1. Navigate to `/seller/offers`.
    2. Locate the inactive offer.
    3. Click the activate action.

**Expected result:**
    - Offer becomes active.
    - Offer status is updated in the seller offer list.
    - A success toast displays `Ponuda je aktivirana.`.
    - If the offer otherwise satisfies public availability conditions, it becomes available again through the public offer listing.

### TC-OFFER-016 – API - Seller successfully reactivates own inactive offer

**Preconditions:**
    - An approved seller is authenticated and has a valid access token.
    - Seller owns an inactive offer.

**Test data:**
    - Valid seller access token.
    - Valid seller-owned inactive offer ID.

**Steps:**
    1. Create a `PATCH` request to `/api/v1/offers/{offerId}/activate`.
    2. Provide the seller access token.
    3. Send the request.

**Expected result:**
    - Server returns HTTP status `200`.
    - Response body contains message `Offer activated successfully.`.
    - Returned offer has `isActive` set to `true`.

---

# Order Lifecycle

### Scenario: ORDER-01 – Seller can accept or reject a pending order

### TC-ORDER-001 – API - Seller accepts a pending order

**Preconditions:**
    - Seller is authenticated and owns the received order.
    - Order status is `pending`.

**Test data:**
    - Valid seller access token.
    - Valid order ID.
    - Valid future `estimatedPickupAt`.

**Steps:**
    1. Send `PATCH /api/v1/orders/received/{orderId}/accept`.
    2. Provide the seller access token.
    3. Send a valid `estimatedPickupAt` value.

**Expected result:**
    - Server returns HTTP status `200`.
    - Response contains message `Order accepted successfully.`.
    - Order status becomes `accepted`.
    - Estimated pickup time is saved.

### TC-ORDER-002 – API - Seller rejects a pending order

**Preconditions:**
    - Seller is authenticated and owns the received order.
    - Order status is `pending`.

**Test data:**
    - Valid seller access token.
    - Valid order ID.
    - Rejection reason between 2 and 500 characters.

**Steps:**
    1. Send `PATCH /api/v1/orders/received/{orderId}/reject`.
    2. Provide the seller access token.
    3. Send a valid `rejectionReason`.

**Expected result:**
    - Server returns HTTP status `200`.
    - Response contains message `Order rejected successfully.`.
    - Order status becomes `rejected`.
    - Rejection reason is saved.

### TC-ORDER-003 – API - Seller cannot accept or reject an order that is not pending

**Preconditions:**
    - Seller is authenticated and owns the received order.
    - Order status is not `pending`.

**Test data:**
    - Test with applicable non-pending states such as `accepted`, `ready`, `completed`, `rejected` or `cancelled`.

**Steps:**
    1. Attempt to accept a non-pending order.
    2. Attempt to reject a non-pending order.

**Expected result:**
    - Accept request returns HTTP status `409` with code `ORDER_CANNOT_BE_ACCEPTED`.
    - Reject request returns HTTP status `409` with code `ORDER_CANNOT_BE_REJECTED`.
    - Order status is not changed.

### Scenario: ORDER-02 – Buyer can cancel an order only while it is pending

### TC-ORDER-004 – API - Buyer cancels a pending order

**Preconditions:**
    - Buyer is authenticated and owns the order.
    - Order status is `pending`.

**Steps:**
    1. Send `PATCH /api/v1/orders/mine/{orderId}/cancel`.
    2. Provide the buyer access token.

**Expected result:**
    - Server returns HTTP status `200`.
    - Response contains message `Order cancelled successfully.`.
    - Order status becomes `cancelled`.

### TC-ORDER-005 – API - Buyer cannot cancel an order that is not pending

**Preconditions:**
    - Buyer is authenticated and owns the order.
    - Order status is not `pending`.

**Test data:**
    - Test with applicable states such as `accepted`, `ready`, `completed`, `rejected` or `cancelled`.

**Steps:**
    1. Send `PATCH /api/v1/orders/mine/{orderId}/cancel`.

**Expected result:**
    - Server returns HTTP status `409`.
    - Response contains code `ORDER_CANNOT_BE_CANCELLED`.
    - Response contains message `Only pending orders can be cancelled.`.
    - Order status is not changed.

### Scenario: ORDER-03 – Seller can mark an accepted order as ready

### TC-ORDER-006 – API - Seller marks an accepted order as ready

**Preconditions:**
    - Seller is authenticated and owns the received order.
    - Order status is `accepted`.

**Steps:**
    1. Send `PATCH /api/v1/orders/received/{orderId}/ready`.
    2. Provide the seller access token.

**Expected result:**
    - Server returns HTTP status `200`.
    - Response contains message `Order marked as ready successfully.`.
    - Order status becomes `ready`.
    - Pickup code data is generated for the order.

### TC-ORDER-007 – API - Seller cannot mark a non-accepted order as ready

**Preconditions:**
    - Seller is authenticated and owns the received order.
    - Order status is not `accepted`.

**Test data:**
    - Test with applicable states such as `pending`, `ready`, `completed`, `rejected` or `cancelled`.

**Steps:**
    1. Send `PATCH /api/v1/orders/received/{orderId}/ready`.

**Expected result:**
    - Server returns HTTP status `409`.
    - Response contains code `ORDER_CANNOT_BE_MARKED_READY`.
    - Response contains message `Only accepted orders can be marked as ready.`.
    - Order status is not changed.

### Scenario: ORDER-04 – Buyer can mark a ready order as on the way

### TC-ORDER-008 – API - Buyer marks a ready order as on the way

**Preconditions:**
    - Buyer is authenticated and owns the order.
    - Order status is `ready`.
    - Buyer has not already marked the order as on the way.

**Steps:**
    1. Send `PATCH /api/v1/orders/mine/{orderId}/on-the-way`.
    2. Provide the buyer access token.

**Expected result:**
    - Server returns HTTP status `200`.
    - Response contains message `Seller notified that buyer is on the way.`.
    - `buyerOnTheWayAt` is set.
    - Order status remains `ready`.

### TC-ORDER-009 – API - Buyer cannot use on-the-way action in an invalid state or more than once

**Preconditions:**
    - Buyer is authenticated and owns the order.

**Test data:**
    - Variant 1: order status is not `ready`.
    - Variant 2: order is `ready`, but `buyerOnTheWayAt` is already set.

**Steps:**
    1. Send the on-the-way request for each test-data variant.

**Expected result:**
    - Non-ready order returns HTTP status `409` with code `BUYER_CANNOT_BE_MARKED_ON_THE_WAY`.
    - Repeated action returns HTTP status `409` with code `BUYER_ALREADY_ON_THE_WAY`.
    - Existing order data is not incorrectly changed.

### Scenario: ORDER-05 – Seller can complete a ready order using the pickup code

### TC-ORDER-010 – API - Seller completes a ready order with valid pickup code

**Preconditions:**
    - Seller is authenticated and owns the received order.
    - Order status is `ready`.
    - Pickup code verification is not blocked.

**Test data:**
    - Correct six-digit pickup code shown to the buyer.

**Steps:**
    1. Send `PATCH /api/v1/orders/received/{orderId}/complete`.
    2. Provide the seller access token.
    3. Send the valid `pickupCode`.

**Expected result:**
    - Server returns HTTP status `200`.
    - Response contains message `Order completed successfully.`.
    - Order status becomes `completed`.
    - Pickup code attempt counters are reset.

### TC-ORDER-011 – API - Invalid pickup code does not complete the order

**Preconditions:**
    - Seller is authenticated and owns a `ready` order.
    - Pickup code verification is not blocked.

**Test data:**
    - Incorrect six-digit pickup code.

**Steps:**
    1. Send the complete request with an incorrect pickup code.

**Expected result:**
    - Server returns HTTP status `422`.
    - Response contains code `INVALID_PICKUP_CODE`.
    - Response indicates the remaining number of attempts.
    - Order remains `ready`.

### TC-ORDER-012 – API - Pickup code verification is blocked after too many incorrect attempts

**Preconditions:**
    - Seller is authenticated and owns a `ready` order.
    - Pickup code verification is initially not blocked.

**Steps:**
    1. Submit an incorrect six-digit pickup code repeatedly until the fifth incorrect attempt.
    2. Attempt another pickup code verification while the block is active.

**Expected result:**
    - Fifth incorrect attempt returns HTTP status `429` with code `PICKUP_CODE_TEMPORARILY_BLOCKED`.
    - Additional attempts during the block return HTTP status `429`.
    - Order remains `ready`.
    - Verification remains blocked for the configured 15-minute period.

### TC-ORDER-013 – API - Seller cannot complete an order that is not ready

**Preconditions:**
    - Seller is authenticated and owns the received order.
    - Order status is not `ready`.

**Test data:**
    - Test with applicable states such as `pending`, `accepted`, `completed`, `rejected` or `cancelled`.

**Steps:**
    1. Send the complete request with a correctly formatted pickup code.

**Expected result:**
    - Server returns HTTP status `409`.
    - Response contains code `ORDER_CANNOT_BE_COMPLETED`.
    - Response contains message `Only ready orders can be completed.`.
    - Order status is not changed.

### Scenario: ORDER-06 – Pickup information is shown only when it should be available

### TC-ORDER-014 – API - Buyer receives pickup address and pickup code only in allowed order states

**Preconditions:**
    - Buyer is authenticated and owns the tested orders.

**Test data:**
    - Orders in `pending`, `accepted`, `ready`, `completed`, `rejected` and `cancelled` states.

**Steps:**
    1. Request each order using `GET /api/v1/orders/mine/{orderId}`.
    2. Compare the pickup information returned for each state.

**Expected result:**
    - `pickupAddress` is hidden for `pending`, `rejected` and `cancelled` orders.
    - `pickupAddress` is visible for `accepted`, `ready` and `completed` orders.
    - Pickup code is returned to the buyer only while the order is `ready`.
    - Internal pickup-code attempt and block fields are not exposed to the buyer.

### TC-ORDER-015 – UI - Seller accepts a pending order

**Preconditions:**
    - Seller is logged in.
    - Seller has a received order with status `pending`.

**Steps:**
    1. Open the pending order.
    2. Accept the order.
    3. Enter the required pickup time if requested by the UI.
    4. Confirm the action.

**Expected result:**
    - Order is accepted.
    - Order is shown with status `accepted`.
    - Pickup time is shown correctly.

### TC-ORDER-016 – UI - Seller rejects a pending order

**Preconditions:**
    - Seller is logged in.
    - Seller has a received order with status `pending`.

**Test data:**
    - Valid rejection reason.

**Steps:**
    1. Open the pending order.
    2. Choose the reject action.
    3. Enter a valid rejection reason.
    4. Confirm the action.

**Expected result:**
    - Order is rejected.
    - Order is shown with status `rejected`.
    - Rejection reason is shown where applicable.

### TC-ORDER-017 – UI - Buyer cancels a pending order

**Preconditions:**
    - Buyer is logged in.
    - Buyer owns an order with status `pending`.

**Steps:**
    1. Open the pending order.
    2. Cancel the order.
    3. Confirm the action.

**Expected result:**
    - Order is cancelled.
    - Order is shown with status `cancelled`.
    - Actions that are no longer allowed are not available.

### TC-ORDER-018 – UI - Seller marks an accepted order as ready

**Preconditions:**
    - Seller is logged in.
    - Seller owns a received order with status `accepted`.

**Steps:**
    1. Open the accepted order.
    2. Mark the order as ready.

**Expected result:**
    - Order status changes to `ready`.
    - Buyer can see the pickup code for the ready order.

### TC-ORDER-019 – UI - Buyer marks a ready order as on the way

**Preconditions:**
    - Buyer is logged in.
    - Buyer owns an order with status `ready`.
    - Buyer has not already used the on-the-way action.

**Steps:**
    1. Open the ready order.
    2. Use the on-the-way action.

**Expected result:**
    - Action succeeds.
    - UI shows that the seller has been notified.
    - Order remains in `ready` status.
    - The same action cannot be used again.

### TC-ORDER-020 – UI - Seller completes a ready order with valid pickup code

**Preconditions:**
    - Seller is logged in.
    - Seller owns a received order with status `ready`.

**Test data:**
    - Valid pickup code shown to the buyer.

**Steps:**
    1. Open the ready order.
    2. Choose the complete order action.
    3. Enter the valid pickup code.
    4. Confirm the action.

**Expected result:**
    - Order is completed successfully.
    - Order status changes to `completed`.

### TC-ORDER-021 – UI - Invalid pickup code does not complete the order

**Preconditions:**
    - Seller is logged in.
    - Seller owns a received order with status `ready`.

**Test data:**
    - Incorrect six-digit pickup code.

**Steps:**
    1. Open the ready order.
    2. Try to complete it using the incorrect pickup code.

**Expected result:**
    - Order is not completed.
    - Order remains `ready`.
    - UI informs the seller that the pickup code is incorrect.

### TC-ORDER-022 – UI - Pickup code is temporarily blocked after too many invalid attempts

**Preconditions:**
    - Seller is logged in.
    - Seller owns a received order with status `ready`.

**Steps:**
    1. Enter an incorrect pickup code repeatedly until the attempt limit is reached.
    2. Try to verify another code while the block is active.

**Expected result:**
    - Verification becomes temporarily blocked after the allowed number of failed attempts.
    - UI informs the seller that further attempts are temporarily blocked.
    - Order remains `ready`.

### TC-ORDER-023 – UI - Pickup information is shown only in allowed order states

**Preconditions:**
    - Buyer is logged in.
    - Buyer has orders in different lifecycle states.

**Steps:**
    1. Open orders in `pending`, `accepted`, `ready`, `completed`, `rejected` and `cancelled` states.
    2. Compare the pickup information shown for each state.

**Expected result:**
    - Pickup address is hidden before the order is accepted and for rejected/cancelled orders.
    - Pickup address is shown for accepted, ready and completed orders.
    - Pickup code is shown only while the order is `ready`.

### TC-ORDER-024 – UI - Order actions are not available in invalid lifecycle states

**Preconditions:**
    - Buyer and seller have orders in different lifecycle states.

**Steps:**
    1. Open non-pending orders as seller and check accept/reject actions.
    2. Open non-pending orders as buyer and check cancel action.
    3. Open non-accepted orders as seller and check ready action.
    4. Open non-ready orders as seller and check complete action.

**Expected result:**
    - Accept and reject actions are available only for `pending` orders.
    - Cancel action is available only for `pending` orders.
    - Ready action is available only for `accepted` orders.
    - Complete action is available only for `ready` orders.

---

# Order Creation and Inventory

### Scenario: INVENTORY-01 – Buyer can create an order when offer and quantity are valid

### TC-INVENTORY-001 – API - Buyer successfully creates an order with valid items

**Preconditions:**
    - Buyer is authenticated and has a valid access token.
    - Selected offers are active, available and belong to the same approved seller.
    - Seller is accepting new orders.
    - Buyer is not the owner of the selected offers.
    - Each selected offer has enough available quantity.

**Test data:**
    - One or more valid offer IDs from the same seller.
    - Valid integer quantities greater than or equal to 1.
    - Optional buyer note up to 500 characters.

**Steps:**
    1. Send `POST /api/v1/orders`.
    2. Provide the buyer access token.
    3. Send valid order items and an optional buyer note.

**Expected result:**
    - Server returns HTTP status `201`.
    - Response contains message `Order created successfully.`.
    - Created order has status `pending`.
    - Order belongs to the authenticated buyer and the correct seller.

### Scenario: INVENTORY-02 – Invalid order creation is rejected

### TC-INVENTORY-002 – API - Order creation is rejected when business rules are not satisfied

**Preconditions:**
    - Buyer is authenticated and has a valid access token.

**Test data:**
    Test the applicable variants separately:
    - one or more offer IDs do not exist;
    - items belong to different sellers;
    - seller is not approved;
    - seller is not accepting new orders;
    - buyer attempts to order their own offer;
    - offer is inactive or sold out;
    - requested quantity is greater than available quantity.

**Steps:**
    1. Send `POST /api/v1/orders` using each invalid business-rule variant.
    2. Record the response and verify that no order is created.

**Expected result:**
    - Missing offer returns `404 OFFER_NOT_FOUND`.
    - Offers from multiple sellers return `409 MULTIPLE_SELLERS_NOT_ALLOWED`.
    - Offer from an unapproved seller returns `409 OFFER_NOT_AVAILABLE`.
    - Closed seller returns `409 SELLER_CLOSED`.
    - Ordering own offer returns `403 OWN_OFFER_ORDER_NOT_ALLOWED`.
    - Inactive or sold-out offer returns `409 OFFER_NOT_AVAILABLE`.
    - Quantity greater than available returns `409 INSUFFICIENT_OFFER_QUANTITY`.
    - No invalid order is persisted.

### TC-INVENTORY-003 – API - Invalid order request data is rejected by validation

**Preconditions:**
    - Buyer is authenticated and has a valid access token.

**Test data:**
    Use validation variants such as:
    - empty `items` array;
    - more than 30 items;
    - same `offerId` repeated in the order;
    - quantity equal to 0, negative or non-integer;
    - missing `offerId`;
    - buyer note longer than 500 characters.

**Steps:**
    1. Send `POST /api/v1/orders` using each invalid payload variant.

**Expected result:**
    - Server returns HTTP status `400`.
    - Response contains error code `VALIDATION_ERROR`.
    - Response contains message `Invalid request data.`.
    - No order is created.

### Scenario: INVENTORY-03 – Order creation updates quantity and price data correctly

### TC-INVENTORY-004 – API/DB - Order creation decreases available quantity and stores correct price snapshot

**Preconditions:**
    - Buyer is authenticated.
    - Active offer has a known price and available quantity.
    - Requested quantity is available.

**Test data:**
    - Known offer price.
    - Known quantity before ordering.
    - Requested order quantity.

**Steps:**
    1. Record the offer's current price and available quantity.
    2. Create an order containing the offer.
    3. Read the created order.
    4. Read the offer after order creation.

**Expected result:**
    - Offer `availableQuantity` is reduced exactly by the ordered quantity.
    - Order item `unitPrice` equals the offer price at the time the order was created.
    - Order item `totalPrice` equals `unitPrice × quantity`.
    - Order `totalPrice` equals the sum of all item totals.
    - Later changes to the offer price do not change the stored order price snapshot.

### TC-INVENTORY-005 – API/DB - Failed multi-item order restores quantities already reduced during the request

**Preconditions:**
    - Buyer is authenticated.
    - Two or more active offers belong to the same seller.
    - An earlier item in the request has enough quantity.
    - A later item does not have enough quantity.

**Steps:**
    1. Record available quantities of all offers in the attempted order.
    2. Send an order request where processing can reduce an earlier item before a later item fails because of insufficient quantity.
    3. Read the affected offers after the failed request.

**Expected result:**
    - Order creation fails.
    - No order is persisted.
    - Any quantity reduced before the failure is restored.
    - All affected offers have the same available quantities they had before the failed request.

### Scenario: INVENTORY-04 – Order cancellation, rejection and concurrent ordering keep inventory correct

### TC-INVENTORY-006 – API/DB - Cancelling a pending order restores reserved quantity

**Preconditions:**
    - Buyer owns a `pending` order.
    - Order creation previously reduced offer quantity.

**Steps:**
    1. Record current offer quantity.
    2. Cancel the pending order.
    3. Read the offer again.

**Expected result:**
    - Order becomes `cancelled`.
    - Quantity from every order item is returned to its offer exactly once.
    - Available quantity matches the value expected before the cancelled order was created.

### TC-INVENTORY-007 – API/DB - Rejecting a pending order restores reserved quantity

**Preconditions:**
    - Seller owns a received `pending` order.
    - Order creation previously reduced offer quantity.

**Steps:**
    1. Record current offer quantity.
    2. Reject the pending order with a valid reason.
    3. Read the offer again.

**Expected result:**
    - Order becomes `rejected`.
    - Quantity from every order item is returned to its offer exactly once.
    - Available quantity matches the value expected before the rejected order was created.

### TC-INVENTORY-008 – API/DB - Concurrent orders cannot reduce offer quantity below zero

**Preconditions:**
    - At least two buyers can order the same active offer.
    - Offer has limited available quantity that is not enough to satisfy both requests together.

**Steps:**
    1. Record the offer's available quantity.
    2. Send competing order requests for the same offer as close together as possible.
    3. Read both responses and the final offer quantity.

**Expected result:**
    - Only requests that can be satisfied by available stock succeed.
    - At least one competing request is rejected when remaining stock is insufficient.
    - Final `availableQuantity` is never negative.
    - Total successfully ordered quantity does not exceed the quantity available before the requests.

### TC-INVENTORY-009 – UI - Buyer creates an order from the cart

**Preconditions:**
    - Buyer is logged in.
    - Cart contains available offers from one seller.
    - Requested quantities are available.

**Steps:**
    1. Open the cart.
    2. Review the items and total.
    3. Create the order through the UI.

**Expected result:**
    - Order is created successfully.
    - Buyer can see the new order in their orders.
    - Ordered quantities and total match the cart.

### TC-INVENTORY-010 – UI - Buyer cannot order more than the available quantity

**Preconditions:**
    - Buyer is logged in.
    - An offer has a known limited available quantity.

**Steps:**
    1. Add the offer to the cart.
    2. Try to increase the requested quantity above the available quantity.
    3. Try to create an invalid order if the UI allows reaching checkout.

**Expected result:**
    - UI does not allow a valid order with quantity above current stock.
    - Cart/order quantity never exceeds the available quantity.
    - No invalid order is created.

### TC-INVENTORY-011 – UI - Cancelled or rejected order returns quantity to the offer

**Preconditions:**
    - An offer has known available quantity.
    - Buyer creates an order for that offer.

**Steps:**
    1. Record the available quantity before ordering.
    2. Create an order.
    3. Verify that available quantity is reduced.
    4. Cancel the order as buyer or reject it as seller.
    5. Open the offer again.

**Expected result:**
    - Quantity is reduced after order creation.
    - Quantity is restored after cancellation or rejection.

---

# Offer Browsing and Filtering

### Scenario: BROWSE-01 – Users can search and filter available offers

### TC-BROWSE-001 – UI - User can search and filter available sellers and offers

**Preconditions:**
    - Public sellers exist with active offers in different categories.
    - Test data includes seller names, offer names and descriptions that can be matched by search.

**Test data:**
    Use representative variants:
    - search by seller name;
    - search by offer name;
    - search by text from offer description;
    - filter by category;
    - combine search and category.

**Steps:**
    1. Navigate to `/offers`.
    2. Perform each search and filter variant.
    3. Review the displayed sellers and offer previews.

**Expected result:**
    - Displayed results match the selected search and category.
    - Search can match seller name, offer name or offer description.
    - Category filter returns only sellers with available offers in that category.
    - Combined search and category apply together.
    - Clearing the search restores results for the currently selected category.

### TC-BROWSE-002 – API - Public seller listing applies search and category filters correctly

**Preconditions:**
    - Public sellers exist with active offers in multiple categories.

**Test data:**
    - Valid `search` values matching seller name, offer name or offer description.
    - Valid `category` values.
    - Combined `search` and `category`.

**Steps:**
    1. Send `GET /api/v1/sellers` without filters.
    2. Send requests using `search`, `category`, and both query parameters together.
    3. Compare returned sellers and their offer previews.

**Expected result:**
    - Server returns HTTP status `200`.
    - Response contains message `Sellers retrieved successfully.`.
    - Only matching sellers are returned.
    - Returned offer previews are active and have `availableQuantity > 0`.
    - When category is supplied, returned previews belong to that category.
    - Each returned seller contains at most three matching offer previews.

### Scenario: BROWSE-02 – Users can browse and filter offers from a specific seller

### TC-BROWSE-003 – UI - User can browse available offers on a seller page by category

**Preconditions:**
    - A public seller exists with active offers in more than one category.

**Steps:**
    1. Open `/sellers/{slug}`.
    2. Review the seller's available offers.
    3. Use one of the category navigation links.

**Expected result:**
    - Seller page loads successfully.
    - Only currently available offers are displayed.
    - Offers are grouped into their correct categories.
    - Category navigation keeps the user on the same seller page and moves to the selected category section.
    - `Sve ponude` returns navigation to the full offers section.

### TC-BROWSE-004 – API - Public seller endpoint returns only available offers for that seller

**Preconditions:**
    - An approved and open seller exists with a complete public location.
    - Seller has active, inactive and sold-out offers.

**Steps:**
    1. Send `GET /api/v1/sellers/{slug}`.
    2. Inspect the returned seller and offers.

**Expected result:**
    - Server returns HTTP status `200`.
    - Response contains message `Seller retrieved successfully.`.
    - Returned profile belongs to the requested seller.
    - Only offers with `isActive = true` and `availableQuantity > 0` are returned.
    - Inactive and sold-out offers are not returned.

### Scenario: BROWSE-03 – Unavailable offers and sellers are not shown as available and empty results are handled correctly

### TC-BROWSE-005 – API - Sellers that are not publicly available are excluded from browsing

**Preconditions:**
    - Test sellers exist in different public-availability states.

**Test data:**
    Use variants such as:
    - seller not approved;
    - seller not accepting orders;
    - seller without city;
    - seller without required pickup address data;
    - seller with no active offers;
    - seller whose offers are all sold out.

**Steps:**
    1. Send `GET /api/v1/sellers`.
    2. Inspect the returned sellers.

**Expected result:**
    - Server returns HTTP status `200`.
    - Sellers that do not satisfy public availability requirements are not returned.
    - Sellers with no active offer having `availableQuantity > 0` are not returned.

### TC-BROWSE-006 – UI - Search or filter with no matches shows an empty result state

**Preconditions:**
    - Offers page can be loaded successfully.

**Test data:**
    - Search term or search/category combination that matches no available seller or offer.

**Steps:**
    1. Navigate to `/offers`.
    2. Enter a search or select a filter combination with no matches.

**Expected result:**
    - No seller cards are displayed.
    - Page shows `Nema pronađenih prodavaca`.
    - Page suggests changing the search term or category.
    - Page remains usable and the search/filter can be changed.

### TC-BROWSE-007 – UI - Unavailable sellers and offers are not shown as available

**Preconditions:**
    - Test data contains unavailable seller/offer states such as inactive, sold out, unapproved or closed.

**Steps:**
    1. Open `/offers`.
    2. Search or browse for the unavailable seller or offer variants.

**Expected result:**
    - Unavailable offers are not shown as available.
    - Sellers that do not satisfy public availability rules are not shown as available sellers.

### TC-BROWSE-008 – API - Search with no matching sellers or offers returns an empty result

**Preconditions:**
    - Public seller listing endpoint is available.

**Test data:**
    - Search term or search/category combination that matches no available seller or offer.

**Steps:**
    1. Send `GET /api/v1/sellers` with the no-match search/filter values.

**Expected result:**
    - Server returns HTTP status `200`.
    - Returned seller list is empty.
    - Request is handled normally without an error response.

---

# Reports and Moderation

### Scenario: REPORT-01 – Reports can only be created between users connected by an order

### TC-REPORT-001 – API - Buyer or seller can submit a report for their own completed order

**Preconditions:**
    - Reporter is authenticated as a buyer or seller.
    - The related order exists and has status `completed`.
    - For a buyer report, the authenticated buyer owns the order.
    - For a seller report, the order belongs to the authenticated seller profile.
    - Reporter has not already reported this order.

**Test data:**
    - Valid completed order ID.
    - Valid report reason.
    - Optional valid description.

**Steps:**
    1. Send `POST /api/v1/reports`.
    2. Provide the reporter access token.
    3. Send the completed `orderId`, report `reason`, and optional `description`.

**Expected result:**
    - Server returns HTTP status `201`.
    - Response contains message `Report submitted successfully.`.
    - Report is created with status `pending`.
    - Buyer reports the seller connected to the order.
    - Seller reports the buyer connected to the order.
    - Reported user's `reportsCount` is increased by one.

### TC-REPORT-002 – API - User cannot report through an order they do not own or that is not completed

**Preconditions:**
    - Reporter is authenticated.

**Test data:**
    Use representative variants:
    - valid order that belongs to another buyer;
    - valid order that belongs to another seller;
    - own order that is not `completed`;
    - non-existing order ID.

**Steps:**
    1. Send `POST /api/v1/reports` for each invalid relationship/state variant.

**Expected result:**
    - Order belonging to another user returns `404 ORDER_NOT_FOUND`.
    - Non-existing order returns `404 ORDER_NOT_FOUND`.
    - Order that is not completed returns `409 ORDER_CANNOT_BE_REPORTED`.
    - No report is created for any invalid variant.

### Scenario: REPORT-02 – Invalid or duplicate report actions are rejected

### TC-REPORT-003 – API - Same user cannot report the same order more than once

**Preconditions:**
    - Buyer or seller has already submitted a report for a completed order.

**Steps:**
    1. Send another `POST /api/v1/reports` request for the same order using the same reporter.

**Expected result:**
    - Server returns HTTP status `409`.
    - Response contains error code `ORDER_ALREADY_REPORTED`.
    - Response contains message `You have already reported this order.`.
    - A second report is not created.

### TC-REPORT-004 – API - Invalid report payload is rejected

**Preconditions:**
    - Buyer or seller is authenticated.
    - A valid reportable completed order exists.

**Test data:**
    Use invalid payload variants such as:
    - missing `orderId`;
    - unsupported report `reason`;
    - invalid description length.

**Steps:**
    1. Send `POST /api/v1/reports` using each invalid payload variant.

**Expected result:**
    - Server returns HTTP status `400`.
    - Response contains error code `VALIDATION_ERROR`.
    - Report is not created.

### Scenario: REPORT-03 – Admin can view and process reports

### TC-REPORT-005 – UI - Admin can view reports and process a pending report

**Preconditions:**
    - Admin is authenticated.
    - At least one pending report exists.

**Steps:**
    1. Navigate to `/admin/reports`.
    2. Review the available reports.
    3. Open a pending report.
    4. Approve or reject the report using the available admin action.

**Expected result:**
    - Reports page loads successfully.
    - Pending report can be reviewed.
    - After processing, report is no longer pending.
    - Updated report state is shown in the admin interface.

### TC-REPORT-006 – API - Admin can list, approve and reject pending reports

**Preconditions:**
    - Admin is authenticated and has a valid access token.
    - Pending reports exist.

**Steps:**
    1. Send `GET /api/v1/reports/admin`.
    2. Send `GET /api/v1/reports/admin/pending`.
    3. Approve one pending report using `PATCH /api/v1/reports/admin/{reportId}/approve`.
    4. Reject another pending report using `PATCH /api/v1/reports/admin/{reportId}/reject`.

**Expected result:**
    - Report listing requests return HTTP status `200`.
    - Approve request returns HTTP status `200` and message `Report approved successfully.`.
    - Approved report status becomes `approved`.
    - Reject request returns HTTP status `200` and message `Report rejected successfully.`.
    - Rejected report status becomes `rejected`.
    - Review information is stored for processed reports.

### TC-REPORT-007 – API - Already processed report cannot be reviewed again

**Preconditions:**
    - Admin is authenticated.
    - Report status is already `approved` or `rejected`.

**Steps:**
    1. Attempt to approve or reject the already processed report.

**Expected result:**
    - Server returns HTTP status `409`.
    - Response contains error code `REPORT_ALREADY_REVIEWED`.
    - Response contains message `Only pending reports can be reviewed.`.
    - Existing report status is not changed.

### Scenario: REPORT-04 – Manual and automatic moderation actions work correctly

### TC-REPORT-008 – API - Admin can manually suspend, unsuspend, ban and unban users

**Preconditions:**
    - Admin is authenticated and has a valid access token.
    - Target user is not an admin.

**Test data:**
    - Valid user ID.
    - Valid suspension reason.
    - Valid ban reason.

**Steps:**
    1. Send `PATCH /api/v1/admin/users/{userId}/suspend`.
    2. Verify the suspended account state.
    3. Send `PATCH /api/v1/admin/users/{userId}/unsuspend`.
    4. Send `PATCH /api/v1/admin/users/{userId}/ban`.
    5. Verify the banned account state.
    6. Send `PATCH /api/v1/admin/users/{userId}/unban`.

**Expected result:**
    - Suspend returns `200` with message `User suspended successfully.`.
    - Unsuspend returns `200` with message `User unsuspended successfully.`.
    - Ban returns `200` with message `User banned successfully.`.
    - Unban returns `200` with message `User unbanned successfully.`.
    - Suspended and banned users have their active sessions revoked.
    - Unbanning resets `offencesSinceLastBan` to `0`.

### TC-REPORT-009 – API/DB - User is automatically banned after three new confirmed offences

**Preconditions:**
    - Target user is active and has `offencesSinceLastBan = 0`.
    - Three separate pending reports exist against the same user.
    - Admin is authenticated.

**Steps:**
    1. Approve the first report.
    2. Verify `offencesSinceLastBan` becomes `1`.
    3. Approve the second report.
    4. Verify `offencesSinceLastBan` becomes `2`.
    5. Approve the third report.
    6. Read the reported user's account state.

**Expected result:**
    - Each approved report increases both `offences` and `offencesSinceLastBan`.
    - After the third confirmed offence, user status becomes `banned`.
    - `banReason` states that the account was automatically banned after three new confirmed offences.
    - Suspension data is cleared.
    - All active sessions for the banned user are revoked.

### TC-REPORT-010 – UI - Buyer or seller can submit a report for a completed order

**Preconditions:**
    - User is logged in as buyer or seller.
    - A related order exists with status `completed`.
    - The same user has not already reported that order.

**Test data:**
    - Valid report reason.
    - Optional valid description.

**Steps:**
    1. Open the completed order.
    2. Open the report action.
    3. Select a valid reason and enter a description if needed.
    4. Submit the report.

**Expected result:**
    - Report is submitted successfully.
    - UI confirms that the report was created.
    - The same order cannot be reported again by the same user.

### TC-REPORT-011 – UI - User cannot submit a duplicate report for the same order

**Preconditions:**
    - User has already reported a completed order.

**Steps:**
    1. Open the same completed order again.
    2. Try to report it again if the UI still offers the action.

**Expected result:**
    - Duplicate report is not created.
    - Report action is unavailable or UI shows the duplicate-report error.

### TC-REPORT-012 – UI - Admin can suspend, unsuspend, ban and unban a user

**Preconditions:**
    - Admin is logged in.
    - Target account is a buyer or seller.

**Steps:**
    1. Open the admin user management area.
    2. Suspend the user and verify the result.
    3. Remove the suspension.
    4. Ban the user and verify the result.
    5. Remove the ban.

**Expected result:**
    - Each moderation action changes the user state correctly.
    - Updated state is shown in the admin UI.

### TC-REPORT-013 – UI - Report action is available only for an eligible completed order

**Preconditions:**
    - User is logged in as buyer or seller.
    - User has orders in different states and at least one completed order.

**Steps:**
    1. Open a completed order connected to the logged-in user.
    2. Check that the report action is available.
    3. Open orders that are not completed.
    4. Check the report action on those orders.

**Expected result:**
    - Eligible completed order can be reported.
    - Orders that are not completed cannot be reported through the UI.
    - User cannot use the UI to report an unrelated user's order.

### TC-REPORT-014 – UI - Invalid report form data is not submitted

**Preconditions:**
    - User is logged in.
    - User has an eligible completed order.

**Test data:**
    - Missing required reason or other invalid report input exposed by the form.

**Steps:**
    1. Open the report form.
    2. Leave required report data invalid or missing.
    3. Try to submit the report.

**Expected result:**
    - Invalid report is not submitted.
    - UI shows validation feedback for the invalid input.

### TC-REPORT-015 – UI - Automatic ban is visible after the third confirmed offence

**Preconditions:**
    - Admin is logged in.
    - Target user has two confirmed offences since the last ban.
    - A third pending valid report exists against the same user.

**Steps:**
    1. Approve the third report.
    2. Open the relevant admin user/banned-user view.

**Expected result:**
    - Third approved offence is processed successfully.
    - Target user is shown as banned in the admin UI.
    - User is no longer shown as an active account.

---

# Profile Management

### Scenario: PROFILE-01 – User can view and update their own profile

### TC-PROFILE-001 – UI - User views and updates personal profile data

**Preconditions:**
    - Buyer or seller is authenticated.

**Test data:**
    - Valid first name and last name.

**Steps:**
    1. Navigate to `/profile`.
    2. Verify the currently saved profile data.
    3. Open personal profile editing.
    4. Change first name, last name or both.
    5. Save the changes.

**Expected result:**
    - Profile page shows data for the authenticated user.
    - Valid changes are saved successfully.
    - Updated values are displayed after saving.
    - A success toast displays `Lični podaci su uspešno sačuvani.`.

### TC-PROFILE-002 – API - User updates their own profile

**Preconditions:**
    - Buyer or seller is authenticated and has a valid access token.

**Test data:**
    - Valid `firstName`, `lastName`, or both.

**Steps:**
    1. Send `PATCH /api/v1/users/me`.
    2. Provide the authenticated user's access token.
    3. Send at least one valid editable field.

**Expected result:**
    - Server returns HTTP status `200`.
    - Response contains message `User profile updated successfully.`.
    - Returned user contains the updated values.
    - Changes apply only to the authenticated user.

### Scenario: PROFILE-02 – Invalid profile changes are rejected

### TC-PROFILE-003 – UI/API - Invalid personal profile data is rejected

**Preconditions:**
    - Buyer or seller is authenticated.

**Test data:**
    Use representative variants:
    - first or last name shorter than 2 characters;
    - first or last name longer than 50 characters;
    - unsupported characters in a name;
    - empty API update payload.

**Steps:**
    1. Attempt invalid changes through the Profile page.
    2. Send equivalent invalid payloads to `PATCH /api/v1/users/me`.

**Expected result:**
    - UI does not submit invalid form data.
    - Invalid fields show validation feedback.
    - Invalid API payload returns HTTP status `400`.
    - API response contains error code `VALIDATION_ERROR`.
    - Existing saved profile data is not replaced with invalid values.

### Scenario: PROFILE-03 – User and seller account/profile settings can be updated correctly

### TC-PROFILE-004 – API - Password change requires the correct current password

**Preconditions:**
    - User is authenticated.

**Test data:**
    - Correct current password and valid new password.
    - Incorrect current password as negative variant.

**Steps:**
    1. Send `PATCH /api/v1/users/me/password` with the incorrect current password.
    2. Verify the response.
    3. Send the request with the correct current password and a valid different new password.

**Expected result:**
    - Incorrect current password returns HTTP status `401`.
    - Response contains code `INVALID_CURRENT_PASSWORD`.
    - Correct request returns HTTP status `200`.
    - Response contains message `Password changed successfully.`.
    - Existing refresh sessions are revoked after the successful change.

### TC-PROFILE-005 – UI/API - User can deactivate their own active account

**Preconditions:**
    - An active buyer or seller is authenticated.

**Steps:**
    1. From `/profile`, choose account deactivation and confirm the action.
    2. For API verification, send `PATCH /api/v1/users/me/deactivate`.

**Expected result:**
    - API returns HTTP status `200`.
    - Response contains message `Account deactivated successfully.`.
    - User status becomes `deactivated`.
    - Active sessions are revoked.
    - UI logs the user out and redirects to `/login`.
    - Deactivated account can no longer login, as covered by Authentication tests.

### TC-PROFILE-006 – UI/API - Seller can update seller profile information and availability

**Preconditions:**
    - Seller is authenticated.

**Test data:**
    - Valid business name.
    - Optional description.
    - Valid seller pickup address and coordinates.
    - `isOpen` true/false as availability variant.

**Steps:**
    1. Open the seller profile section on `/profile`.
    2. Change valid seller profile data and save it.
    3. Toggle whether the seller is accepting new orders.
    4. Verify through `PATCH /api/v1/sellers/me`.

**Expected result:**
    - Valid seller profile changes are saved.
    - API returns HTTP status `200` with message `Seller profile updated successfully.`.
    - Changing business name updates the seller slug when needed.
    - `isOpen` reflects the selected availability state.
    - UI shows the updated seller data and appropriate success message.

### TC-PROFILE-007 – UI - User changes password from the profile page

**Preconditions:**
    - User is logged in.

**Test data:**
    - Correct current password.
    - Valid new password.

**Steps:**
    1. Open `/profile`.
    2. Open the password change section.
    3. Enter the current password and a valid new password.
    4. Save the change.

**Expected result:**
    - Password is changed successfully.
    - UI confirms the successful change.
    - User can later log in with the new password.

---

# Image Uploads

### Scenario: IMAGE-01 – Seller can upload logo, cover and offer images

### TC-IMAGE-001 – API - Seller uploads supported images

**Preconditions:**
    - Seller is authenticated.
    - For offer image variant, seller owns the target offer.

**Test data:**
    - Valid JPEG, PNG or WEBP file not larger than 5 MB.

**Steps:**
    1. Upload a seller logo using `PATCH /api/v1/sellers/me/profile-image`.
    2. Upload a seller cover using `PATCH /api/v1/sellers/me/cover-image`.
    3. Upload an image for a seller-owned offer using `PATCH /api/v1/offers/{offerId}/image`.
    4. Use multipart form-data field `image`.

**Expected result:**
    - Each valid upload returns HTTP status `200`.
    - Seller logo response contains message `Seller profile image uploaded successfully.`.
    - Seller cover response contains message `Seller cover image uploaded successfully.`.
    - Offer image response contains message `Offer image uploaded successfully.`.
    - Corresponding image URL is updated on the correct resource.

### Scenario: IMAGE-02 – Seller can replace or remove uploaded images

### TC-IMAGE-002 – API - Replacing an image updates the resource and removes the previous stored image

**Preconditions:**
    - Seller is authenticated.
    - Target seller profile or offer already has an uploaded image.

**Test data:**
    - A second valid supported image.

**Steps:**
    1. Record the current image URL.
    2. Upload a new image to the same image field.
    3. Read the updated resource.

**Expected result:**
    - Upload returns HTTP status `200`.
    - Resource contains a new image URL.
    - Previous seller/offer image file managed by the application is removed from storage.
    - Only the new image remains linked to the resource.

### TC-IMAGE-003 – API - Seller can remove logo, cover and offer image

**Preconditions:**
    - Seller is authenticated.
    - Target resource currently has an image.
    - For offer image variant, seller owns the offer.

**Steps:**
    1. Send `DELETE /api/v1/sellers/me/profile-image`.
    2. Send `DELETE /api/v1/sellers/me/cover-image`.
    3. Send `DELETE /api/v1/offers/{offerId}/image` for a seller-owned offer.

**Expected result:**
    - Each request returns HTTP status `200`.
    - Seller responses contain the corresponding `removed successfully` message.
    - Offer response contains message `Offer image removed successfully.`.
    - Image URL becomes `null` on the corresponding resource.

### Scenario: IMAGE-03 – Invalid image uploads are rejected

### TC-IMAGE-004 – UI/API - Unsupported or oversized images are rejected

**Preconditions:**
    - Seller is authenticated.

**Test data:**
    Use representative variants:
    - unsupported MIME type;
    - image larger than 5 MB;
    - request without an `image` file.

**Steps:**
    1. Attempt to upload each invalid file through the available UI image controls.
    2. Send invalid multipart requests directly to an image endpoint.

**Expected result:**
    - UI rejects unsupported formats and shows `Dozvoljeni formati slike su JPG, PNG i WEBP.`.
    - UI rejects files larger than 5 MB and shows `Slika može imati najviše 5 MB.`.
    - No valid resource image is replaced by rejected input.
    - Request without a file returns HTTP status `400` with code `IMAGE_REQUIRED` and message `Image file is required.`.
    - Unsupported/oversized files are rejected by the upload middleware.

### TC-IMAGE-005 – UI - Seller uploads logo, cover and offer images

**Preconditions:**
    - Seller is logged in.
    - Seller owns an offer for the offer-image variant.

**Test data:**
    - Valid JPG, PNG or WEBP image not larger than 5 MB.

**Steps:**
    1. Upload a seller logo.
    2. Upload a seller cover image.
    3. Upload an image for a seller-owned offer.

**Expected result:**
    - Each valid image is uploaded successfully.
    - New image is shown on the correct profile or offer.

### TC-IMAGE-006 – UI - Seller replaces and removes uploaded images

**Preconditions:**
    - Seller is logged in.
    - Seller profile or offer already has an uploaded image.

**Steps:**
    1. Replace an existing image with another valid image.
    2. Verify the new image is shown.
    3. Remove the image through the UI.

**Expected result:**
    - Replacement succeeds and the new image is shown.
    - Remove action clears the image from the correct resource.

### TC-IMAGE-007 – UI - Replaced image remains correct after page refresh

**Preconditions:**
    - Seller is logged in.
    - Seller replaces an existing logo, cover or offer image with another valid image.

**Steps:**
    1. Verify the new image is displayed.
    2. Refresh the page.
    3. Open the same profile or offer again.

**Expected result:**
    - New image is still displayed after refresh.
    - Previous image is not shown again.

---

# Cart Management

### Scenario: CART-01 – Buyer can add, update and remove items from the cart

### TC-CART-001 – UI - Buyer can manage cart items and quantities

**Preconditions:**
    - Available offers exist.

**Test data:**
    - One or more available offers from the same seller.

**Steps:**
    1. Add an available offer to the cart.
    2. Add another offer from the same seller.
    3. Increase and decrease item quantities.
    4. Remove one item.
    5. Clear the cart.

**Expected result:**
    - Added items appear in the cart.
    - Existing item quantity is updated instead of creating a duplicate row for the same offer.
    - Quantity never goes below 1.
    - Removing an item updates cart contents.
    - Clearing the cart removes all items and seller information.

### Scenario: CART-02 – Cart respects quantity, availability and single-seller rules

### TC-CART-002 – UI - Cart enforces available quantity and offer availability

**Preconditions:**
    - Cart contains an offer.

**Test data:**
    - Offer with known available quantity.
    - Updated offer that becomes inactive, sold out or has reduced stock.

**Steps:**
    1. Attempt to set cart quantity above the current available quantity.
    2. Refresh/sync an offer after its available quantity is reduced.
    3. Refresh/sync an offer after it becomes inactive or sold out.

**Expected result:**
    - Cart quantity is capped at `availableQuantity`.
    - Existing quantity is reduced when current stock becomes lower.
    - Inactive or sold-out offer is removed from the cart.
    - Cart never contains an impossible quantity.

### TC-CART-003 – UI - Cart contains offers from only one seller

**Preconditions:**
    - Cart contains an offer from Seller A.
    - Available offer from Seller B exists.

**Steps:**
    1. Attempt to add Seller B's offer to the existing Seller A cart.
    2. Choose to replace the cart with Seller B's offer.

**Expected result:**
    - Application detects that the new offer belongs to a different seller.
    - Existing cart is not silently mixed with the second seller.
    - After confirmed replacement, Seller A items are removed and Seller B offer becomes the cart content.

### Scenario: CART-03 – Cart total and saved state remain correct after changes and refresh

### TC-CART-004 – UI - Cart total and local saved state remain consistent

**Preconditions:**
    - Cart contains one or more items.

**Steps:**
    1. Record item prices and quantities.
    2. Verify the cart total.
    3. Change a quantity and verify the total again.
    4. Refresh the page.
    5. Reopen the cart.

**Expected result:**
    - Cart total equals the sum of `unitPrice × quantity` for all items.
    - Total changes immediately after quantity changes.
    - Cart state is stored under `kuvam-cart` in local storage.
    - Valid cart contents remain available after page refresh.

---

# Location and Address

### Scenario: LOCATION-01 – User can save and update their address

### TC-LOCATION-001 – API - Buyer saves or updates a valid address

**Preconditions:**
    - Buyer is authenticated.
    - Selected city exists and is active.

**Test data:**
    - Valid `cityId`.
    - Valid street and street number.
    - Optional additional information.

**Steps:**
    1. Send `PATCH /api/v1/users/me/location`.
    2. Provide the buyer access token.
    3. Send valid address data.
    4. Read the user profile after the update.

**Expected result:**
    - Server returns HTTP status `200`.
    - Response contains message `User location updated successfully.`.
    - City and address are saved for the buyer.
    - Address is geocoded and latitude/longitude are stored.
    - User profile reports a complete location when all required data and coordinates are present.

### Scenario: LOCATION-02 – Invalid address data is rejected

### TC-LOCATION-002 – API - Invalid buyer location update is rejected

**Preconditions:**
    - Buyer is authenticated.

**Test data:**
    Use representative variants:
    - missing city, street or street number;
    - invalid field lengths;
    - non-existing or inactive city.

**Steps:**
    1. Send each invalid variant to `PATCH /api/v1/users/me/location`.

**Expected result:**
    - Schema-invalid data returns HTTP status `400` with code `VALIDATION_ERROR`.
    - Non-existing or inactive city returns HTTP status `404` with code `CITY_NOT_FOUND`.
    - Invalid address data is not saved.

### TC-LOCATION-003 – API - Seller cannot use buyer location endpoint

**Preconditions:**
    - Seller is authenticated.

**Steps:**
    1. Send a valid-looking location request to `PATCH /api/v1/users/me/location`.

**Expected result:**
    - Server returns HTTP status `403`.
    - Response contains code `BUYER_LOCATION_UPDATE_ONLY`.
    - Seller pickup location is not changed through the buyer endpoint.

### Scenario: LOCATION-03 – User and seller locations affect the correct application functionality

### TC-LOCATION-004 – API/UI - Seller can update pickup location and buyer location is used for local browsing

**Preconditions:**
    - Seller and buyer accounts exist.
    - Selected cities are active.

**Steps:**
    1. Update seller pickup location through `PATCH /api/v1/sellers/me` using city, street, street number and matching coordinates.
    2. Verify the seller profile contains the new pickup location.
    3. Use an authenticated buyer whose location is set.
    4. Load public sellers/offers for that buyer.

**Expected result:**
    - Seller pickup location is saved on the seller profile, not the seller's user address.
    - Seller address data requires city, street and street number together.
    - Latitude and longitude must be provided together when coordinates are updated.
    - Authenticated buyer browsing is scoped to the buyer's city when city information is available to the request.
    - Public seller data does not expose the exact private pickup address before the order flow allows it.

### TC-LOCATION-005 – UI - Buyer saves and updates their address

**Preconditions:**
    - Buyer is logged in.

**Test data:**
    - Valid city, street and street number.

**Steps:**
    1. Open the address/location form.
    2. Enter a valid address.
    3. Save it.
    4. Change the address and save it again.

**Expected result:**
    - Valid address is saved.
    - Updated address is shown after the second save.
    - Location-dependent parts of the application use the updated city.

### TC-LOCATION-006 – UI - Invalid address data is not saved

**Preconditions:**
    - Buyer is logged in.

**Test data:**
    - Missing or invalid required address fields.

**Steps:**
    1. Open the address/location form.
    2. Enter invalid or incomplete data.
    3. Try to save it.

**Expected result:**
    - Invalid address is not saved.
    - UI shows validation feedback for the invalid fields.

---

# Notifications

### Scenario: NOTIF-01 – User receives the correct notifications for relevant events

### TC-NOTIF-001 – UI/API - Relevant order event creates a notification for the correct user

**Preconditions:**
    - Buyer and seller are authenticated users connected by an order.
    - An order action that creates a notification can be performed.

**Steps:**
    1. Perform a relevant order action.
    2. Load `GET /api/v1/notifications` for the expected recipient.
    3. Open the notification menu in the UI.

**Expected result:**
    - Notification is created for the intended recipient.
    - API returns HTTP status `200` with message `Notifications retrieved successfully.`.
    - New notification appears in the recipient's notification list.
    - Notification contains the related order reference.
    - Real-time client state can receive the notification without creating duplicate entries.

### Scenario: NOTIF-02 – User can read and manage only their own notifications

### TC-NOTIF-002 – API - User can mark own notification or all own notifications as read

**Preconditions:**
    - User has at least two unread notifications.

**Steps:**
    1. Read `GET /api/v1/notifications/unread-count`.
    2. Send `PATCH /api/v1/notifications/{notificationId}/read` for one own notification.
    3. Read the unread count again.
    4. Send `PATCH /api/v1/notifications/read-all`.

**Expected result:**
    - Unread count endpoint returns HTTP status `200`.
    - Single notification request returns `200` with message `Notification marked as read.`.
    - The selected notification has `isRead = true`.
    - Unread count decreases accordingly.
    - Read-all returns `200` with message `All notifications marked as read.`.
    - Remaining own notifications have `isRead = true` and client unread count becomes `0`.

### TC-NOTIF-003 – API - User cannot mark another user's notification as read

**Preconditions:**
    - User A and User B exist.
    - A notification belongs to User B.
    - User A is authenticated.

**Steps:**
    1. Send `PATCH /api/v1/notifications/{notificationId}/read` using User B's notification ID and User A's token.

**Expected result:**
    - Server returns HTTP status `404`.
    - Response contains code `NOTIFICATION_NOT_FOUND`.
    - User B's notification is not modified.
    - Notification ownership information is not exposed to User A.

### Scenario: NOTIF-03 – Opening a notification leads to the related order or resource

### TC-NOTIF-004 – UI - Opening an order notification navigates to the correct order

**Preconditions:**
    - Authenticated buyer or seller has an order notification containing an order reference.

**Steps:**
    1. Open the notification menu.
    2. Click an unread order notification.
    3. Repeat with an already-read notification.

**Expected result:**
    - Unread notification is marked as read before navigation when possible.
    - Buyer is navigated to `/orders/{orderId}`.
    - Seller is navigated to `/seller/orders/{orderId}`.
    - Already-read notification also navigates correctly.
    - Navigation still occurs if marking the notification as read fails.

### TC-NOTIF-005 – UI - User can mark notifications as read

**Preconditions:**
    - User is logged in.
    - User has unread notifications.

**Steps:**
    1. Open the notifications menu.
    2. Open or mark one unread notification as read.
    3. Use the mark-all-as-read action if available.

**Expected result:**
    - Selected notification becomes read.
    - Unread indicator/count is updated.
    - Mark-all-as-read clears the remaining unread state.