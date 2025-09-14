# E-commerce Full-Stack Application

A comprehensive e-commerce platform built with Next.js (frontend) and Node.js/Express (backend), featuring role-based access control, multi-language support, and complete CRUD operations.

## 🚀 Features

### Frontend (Next.js)
- **Modern UI/UX** with Bootstrap 5 and responsive design
- **Multi-language Support** (English, Arabic, French, Spanish)
- **Role-based Access Control** with dynamic navigation
- **Complete CRUD Operations** for all entities
- **Shopping Cart** with Stripe payment integration
- **Favorites System** for users
- **Product Reviews & Comments**
- **Admin Dashboard** with analytics
- **Redux Toolkit** for state management

### Backend (Node.js/Express)
- **RESTful API** with comprehensive endpoints
- **Role-based Permissions** system
- **JWT Authentication** with refresh tokens
- **PostgreSQL Database** with Sequelize ORM
- **File Upload** with image compression
- **Swagger API Documentation**
- **Rate Limiting** and security middleware
- **Comprehensive Error Handling**
- **Caching** for improved performance

### Database Models
- Users & Authentication
- Products & Categories
- Orders & Shopping Cart
- Stores & Vendors
- Roles & Permissions
- Promotions & Discounts
- Comments & Reviews
- Favorites & Analytics

## 🛠️ Tech Stack

### Frontend
- Next.js 14
- React 18
- TypeScript
- Redux Toolkit
- Bootstrap 5
- i18next (Internationalization)
- Stripe (Payments)
- SweetAlert2 (Notifications)

### Backend
- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Sequelize ORM
- JWT Authentication
- Multer (File Upload)
- Winston (Logging)
- Swagger (API Docs)

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory:
```env
NODE_ENV=development
PORT=5300
JWT_SECRET=your_jwt_secret_here
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_DATABASE_DEVELOPMENT=ecommerce_dev
DB_HOST=localhost
DB_PORT=5432
DB_DIALECT=postgres
Stripe_Key=your_stripe_publishable_key
WebhookSecret=your_stripe_webhook_secret
CLIENT_URL=http://localhost:3000
```

4. Run the server:
```bash
npm run dev
```

The API will be available at `http://localhost:5300`
API Documentation: `http://localhost:5300/api-docs`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the client directory:
```env
NEXT_PUBLIC_BASE_URL=http://localhost:5300
NEXT_PUBLIC_BASE_URL_Images=http://localhost:5300/uploads
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

4. Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🗄️ Database Schema

The application includes the following main entities:

- **Users**: User accounts with role-based access
- **Products**: Product catalog with images and categories
- **Categories/Subcategories**: Product classification
- **Stores**: Vendor stores
- **Orders**: Order management and tracking
- **Cart**: Shopping cart functionality
- **Favorites**: User favorite products
- **Comments**: Product reviews and ratings
- **Promotions**: Discount codes and offers
- **Roles/Permissions**: Access control system

## 🔐 Authentication & Authorization

### Roles
- **Super Admin**: Full system access
- **Admin**: User and content management
- **Vendor**: Store and product management
- **Customer**: Shopping and account management

### Permissions
- User management
- Product management
- Order management
- Category management
- Role management
- Analytics access

## 🌍 Internationalization

The application supports multiple languages:
- English (default)
- Arabic (RTL support)
- French
- Spanish

Language preferences are stored in localStorage and automatically detected from browser settings.

## 📱 API Endpoints

### Authentication
- `POST /api/auth/signin` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/forgot-password` - Password reset

### Products
- `GET /api/shop` - Get all products
- `POST /api/shop` - Create product
- `PUT /api/shop/:id` - Update product
- `DELETE /api/shop/:id` - Delete product

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order
- `PUT /api/orders/:id` - Update order status

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/orders` - Get all orders
- `GET /api/admin/roles` - Get all roles
- `GET /api/admin/permissions` - Get all permissions

## 🚀 Deployment

### Backend Deployment
1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

### Frontend Deployment
1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## 🧪 Testing

Run tests for both frontend and backend:

```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test
```

## 📊 Performance Optimizations

- **Caching**: Redis-based caching for frequently accessed data
- **Image Optimization**: Automatic image compression and resizing
- **Database Indexing**: Optimized database queries
- **CDN Integration**: Static asset delivery
- **Code Splitting**: Lazy loading for better performance

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
- `NODE_ENV`: Environment (development/production)
- `PORT`: Server port
- `JWT_SECRET`: JWT signing secret
- `DB_*`: Database connection settings
- `Stripe_Key`: Stripe publishable key
- `WebhookSecret`: Stripe webhook secret

#### Frontend (.env.local)
- `NEXT_PUBLIC_BASE_URL`: Backend API URL
- `NEXT_PUBLIC_BASE_URL_Images`: Image server URL
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Stripe key

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation at `/api-docs`
- Review the code comments and documentation

## 🔄 Version History

- **v1.0.0**: Initial release with basic functionality
- **v1.1.0**: Added role-based access control
- **v1.2.0**: Implemented multi-language support
- **v1.3.0**: Added comprehensive CRUD operations
- **v1.4.0**: Performance optimizations and Swagger docs