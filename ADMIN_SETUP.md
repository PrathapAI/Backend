# Admin and Supervisor Dashboard Setup

## Overview
The application now has two protected admin pages:
1. **Admin Dashboard** (`/admin-dashboard`) - Full access to user and listing management
2. **Supervisor Dashboard** (`/supervisor-dashboard`) - Access to listing verification

## User Roles
- `user` - Regular users (default)
- `supervisor` - Can manage listings (activate, deactivate, delete)
- `admin` - Full access to both user and listing management

## Setting User Roles

### Method 1: Direct Database Update (PostgreSQL)
```sql
-- Set a user as admin
UPDATE "Users" SET "Role" = 'admin' WHERE "Email" = 'admin@example.com';

-- Set a user as supervisor
UPDATE "Users" SET "Role" = 'supervisor' WHERE "Email" = 'supervisor@example.com';

-- Set a user back to regular user
UPDATE "Users" SET "Role" = 'user' WHERE "Email" = 'user@example.com';
```

### Method 2: Using pgAdmin or Database GUI
1. Connect to your PostgreSQL database
2. Navigate to the `Users` table
3. Find the user you want to modify
4. Update the `Role` column to `admin`, `supervisor`, or `user`
5. Save the changes

### Method 3: Create Initial Admin via SQL
```sql
-- Create an admin user (run this after registering normally)
INSERT INTO "Users" (
  "Username", "Email", "Password", "Role", "IsActive"
) VALUES (
  'admin',
  'admin@campaign-star.com',
  '$2a$10$your_hashed_password_here',
  'admin',
  true
);
```

## Features

### Admin Dashboard Features
- **User Management Tab**
  - View all users
  - Activate/Deactivate user accounts
  - Delete users
  - See user details (ID, Username, Email, Phone, Status)

- **Listing Management Tab**
  - View all listings
  - Activate/Deactivate listings
  - Delete listings
  - See listing details (ID, Title, Owner, Price, Status)

### Supervisor Dashboard Features
- **Listing Verification**
  - View all listings with full details
  - View listing details (redirects to listing page)
  - Activate/Deactivate listings
  - Delete listings
  - See listing metadata (Category, Posted Date, Owner)

## Access Control
- Regular users cannot access admin or supervisor dashboards
- Supervisors can access the supervisor dashboard only
- Admins can access both admin and supervisor dashboards
- Navigation links only appear for users with appropriate roles
- Attempting to access protected routes without permission redirects to home page with an alert

## Navigation
- **Admin users** will see both "admin" and "supervisor" links in the navbar
- **Supervisor users** will see only the "supervisor" link in the navbar
- **Regular users** will not see any admin links

## Security
- Routes are protected using the `ProtectedRoute` component
- JWT tokens include the user's role
- Backend validates user permissions (ensure to add middleware on backend routes if needed)
- Unauthorized access attempts are logged and redirected

## Testing
1. Register a new user
2. Update their role in the database using SQL
3. Log out and log back in (to get new JWT token with role)
4. Navigate to the appropriate dashboard

## Notes
- Users must log out and log back in after role changes to receive updated JWT tokens
- The Role field was added to the User model with a default value of 'user'
- Existing users will need their Role field populated (defaults to 'user')
