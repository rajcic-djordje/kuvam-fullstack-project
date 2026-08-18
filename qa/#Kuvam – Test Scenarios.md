# Kuvam – Test Scenarios

## 1. Authentication and Account Access

- **AUTH-01** – User can log in with valid credentials
- **AUTH-02** – Login fails with invalid credentials or invalid input
- **AUTH-03** – User can register with valid data
- **AUTH-04** – Registration fails with invalid data or already registered email
- **AUTH-05** – Account status affects login and protected access
- **AUTH-06** – Password change, logout and authentication state work correctly

## 2. Authorization and Resource Ownership

- **AUTHZ-01** – Users can access only functionality allowed for their role
- **AUTHZ-02** – Buyer can access only their own orders
- **AUTHZ-03** – Seller can access and manage only their own offers
- **AUTHZ-04** – Seller can access and manage only orders related to their seller profile
- **AUTHZ-05** – User can only modify their own profile

## 3. Seller Approval and Account Status

- **STATUS-01** – Seller functionality depends on approval status
- **STATUS-02** – Suspension blocks protected functionality and removing it restores access
- **STATUS-03** – Admin can approve or reject pending seller applications
- **STATUS-04** – Already processed seller applications cannot be processed again

## 4. Offer Management

- **OFFER-01** – Seller can create and update their own offers
- **OFFER-02** – Seller can activate and deactivate their own offers
- **OFFER-03** – Seller can delete an offer only when deletion is allowed
- **OFFER-04** – Invalid offer data is rejected

## 5. Order Lifecycle

- **ORDER-01** – Seller can accept or reject a pending order
- **ORDER-02** – Buyer can cancel an order only while it is pending
- **ORDER-03** – Seller can mark an accepted order as ready
- **ORDER-04** – Buyer can mark a ready order as on the way
- **ORDER-05** – Seller can complete a ready order using the pickup code
- **ORDER-06** – Pickup information is shown only when it should be available

## 6. Order Creation and Inventory

- **INVENTORY-01** – Buyer can create an order when offer and quantity are valid
- **INVENTORY-02** – Invalid order creation is rejected
- **INVENTORY-03** – Order creation updates quantity and price data correctly
- **INVENTORY-04** – Order cancellation, rejection and concurrent ordering keep inventory correct

## 7. Offer Browsing and Filtering

- **BROWSE-01** – Users can search and filter available offers
- **BROWSE-02** – Users can browse and filter offers from a specific seller
- **BROWSE-03** – Unavailable offers and sellers are not shown as available and empty results are handled correctly

## 8. Reports and Moderation

- **REPORT-01** – Reports can only be created between users connected by an order
- **REPORT-02** – Invalid or duplicate report actions are rejected
- **REPORT-03** – Admin can view and process reports
- **REPORT-04** – Manual and automatic moderation actions work correctly

## 9. Profile Management

- **PROFILE-01** – User can view and update their own profile
- **PROFILE-02** – Invalid profile changes are rejected
- **PROFILE-03** – User and seller account/profile settings can be updated correctly

## 10. Image Uploads

- **IMAGE-01** – Seller can upload logo, cover and offer images
- **IMAGE-02** – Seller can replace or remove uploaded images
- **IMAGE-03** – Invalid image uploads are rejected

## 11. Cart Management

- **CART-01** – Buyer can add, update and remove items from the cart
- **CART-02** – Cart respects quantity, availability and single-seller rules
- **CART-03** – Cart total and saved state remain correct after changes and refresh

## 12. Location and Address

- **LOCATION-01** – User can save and update their address
- **LOCATION-02** – Invalid address data is rejected
- **LOCATION-03** – User and seller locations affect the correct parts of the application

## 13. Notifications

- **NOTIF-01** – User receives the correct notifications for relevant events
- **NOTIF-02** – User can read and manage only their own notifications
- **NOTIF-03** – Opening a notification leads to the related order or resource
