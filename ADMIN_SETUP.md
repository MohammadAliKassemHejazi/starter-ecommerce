# Admin Setup Guide

This guide explains how to set up the default admin user and understand the role-based navigation system.

## Default Admin User

The system comes with a default admin user that has full access to all features.

### Login Credentials
- **Email**: `admin@admin.com`
- **Password**: `admin`

### Creating the Admin User

To create the default admin user, run one of the following commands in the server directory:

```bash
# Run all setup scripts (recommended)
npm run setup

# Or just create the admin user
npm run create-admin
```

This will:
1. Create the admin user with the credentials above
2. Create all necessary permissions
3. Create the admin role with full permissions
4. Assign the admin role to the admin user

## Role-Based Navigation

The navigation system automatically adapts based on the user's role:

### Admin Users
- **Full Access**: All features and pages
- **User Management**: Users, Roles, Permissions
- **Content Management**: Categories, Subcategories, Products, Articles
- **Business Management**: Orders, Promotions, Analytics, Returns
- **System Management**: Packages, Shipping, Sizes, Taxes
- **System Logs**: Audit Logs, User Sessions

### Vendor Users
- **Dashboard**: Vendor-specific analytics
- **My Store**: Store management
- **Products**: Product management
- **Orders**: Order management

### Regular Users
- **Shop**: Browse products
- **Cart**: Shopping cart
- **Favorites**: Favorite products
- **Orders**: Order history

## Navigation Features

### Mobile Navigation
- **Hamburger Menu**: Accessible on mobile devices
- **Collapsible Sections**: Organized by category
- **Quick Actions**: Role-specific quick access buttons

### Desktop Navigation
- **Dropdown Menus**: Organized by user role
- **Cart Counter**: Real-time cart item count
- **User Info**: Display current user and role

### Quick Actions
Each role has specific quick actions:
- **Admin**: Create User, Create Category, Create Product, View Analytics
- **Vendor**: Add Product, View Orders, Dashboard
- **User**: Browse Products, My Orders, My Favorites

## Security Features

### Permission System
- **Granular Permissions**: Each action requires specific permissions
- **Role-Based Access**: Users can only access features based on their role
- **Route Protection**: Frontend routes are protected by role requirements

### Authentication
- **JWT Tokens**: Secure authentication with JSON Web Tokens
- **Password Hashing**: Passwords are securely hashed using bcrypt
- **Session Management**: User sessions are tracked and managed

## Customization

### Adding New Roles
1. Create the role in the database
2. Assign appropriate permissions
3. Update the navigation configuration
4. Add role-specific translations

### Adding New Permissions
1. Add the permission to the database
2. Update the permission middleware
3. Add permission checks to routes
4. Update the frontend permission hooks

### Modifying Navigation
1. Update `client/src/config/navigation.ts`
2. Add new translation keys
3. Update the Navigation component if needed

## Troubleshooting

### Admin User Not Created
- Check database connection
- Ensure all models are properly defined
- Check console for error messages

### Navigation Not Showing
- Verify user is logged in
- Check user role assignment
- Ensure permissions are properly set

### Permission Denied
- Check if user has required permissions
- Verify role assignment
- Check permission middleware configuration

## Development

### Testing Different Roles
1. Create test users with different roles
2. Log in as different users
3. Verify navigation changes
4. Test permission restrictions

### Adding New Features
1. Define required permissions
2. Update navigation configuration
3. Add role-based access controls
4. Update translations
5. Test with different user roles

## Support

For issues or questions:
1. Check the console logs
2. Verify database connections
3. Check user permissions
4. Review the navigation configuration
