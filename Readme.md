# Vehicle CMS with Multi-tenancy

This is a Content Management System (CMS) for vehicles built with NestJS, implementing a multi-tenant architecture. The system is designed to handle vehicle transfers across multiple isolated tenants, with a focus on project management and organizational units.

## 🚀 Features

- Multi-tenant architecture with complete data isolation
- Dual authentication system (cookie-based and Bearer token)
- RESTful API documented with Swagger
- PostgreSQL database with TypeORM
- Granular roles and permissions system
- Attack protection with Helmet
- Rate limiting with Throttler
- Project and organizational unit management
- Vehicle transfer system
- Audit and operation traceability

## 📋 Prerequisites

- Node.js (recommended version: 18.x or higher)
- PostgreSQL

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/GhostemaneUrs/vehicle-cms
cd vehicle-cms
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp env.example .env
```
Edit the `.env` file with your configurations.

## 🏗️ Project Structure

```
src/
├── auth/            # Authentication and authorization module
├── common/          # Common utilities, pipes and decorators
├── config/          # Configuration loading and environment variables
├── database/        # Database connection and migrations/schemas
├── organizational/  # Organization logic (roles, permissions, structure)
├── projects/        # Project management module
├── seeds/           # Initialization scripts and test data
├── tenancy/         # Multi-tenancy management (schemas, contexts)
├── transfers/       # Vehicle transfer operations module
├── @types/          # Custom TypeScript type definitions
└── vehicles/        # Vehicle management module
```

## 🚀 Usage

### Development
```bash
# Start in development mode
npm run start:dev

# Run migrations
npm run db:migrate

# Run seeds
npm run db:seed-tenancy
npm run db:seed-roles
```

### Production
```bash
# Build the application
npm run build

# Start in production mode
npm run start:prod
```

## 📝 Available Scripts

- `npm run start:dev` - Start the server in development mode
- `npm run build` - Build the project
- `npm run start:prod` - Start the server in production mode
- `npm run db:migrate` - Run database migrations
- `npm run db:rollback` - Rollback migrations
- `npm run db:seed-tenancy` - Run tenancy seeds
- `npm run db:seed-roles` - Run roles and permissions seeds
- `npm run format` - Format the code
- `npm run lint` - Run the linter

## 🔐 Environment Variables

The required environment variables are defined in the `env.example` file. Make sure to configure:

### Database Configuration
- `POSTGRES_HOST` - Database host
- `POSTGRES_PORT` - Database port
- `POSTGRES_USER` - Database user
- `POSTGRES_PASSWORD` - Database password
- `POSTGRES_DB` - Database name

### Token Configuration
- `ACCESS_TOKEN_SECRET` - Access token secret key
- `REFRESH_TOKEN_SECRET` - Refresh token secret key
- `ACCESS_TOKEN_EXPIRES_IN` - Access token expiration time (default: 900s)
- `REFRESH_TOKEN_EXPIRES_IN` - Refresh token expiration time (default: 7d)

### Application Configuration
- `PORT` - Application port (default: 3000)
- `TENANCY` - Tenant identifier (example: "moradela")

## 🔒 Security

The system implements several security layers:

1. **Authentication**:
   - JWT for stateless authentication
   - Refresh tokens for secure renewal
   - Secure cookies for web sessions

2. **Authorization**:
   - Granular roles and permissions
   - Route guards
   - Tenant validation

3. **Protection**:
   - Rate limiting to prevent brute force attacks
   - Helmet for security headers
   - Data validation with class-validator

## 📚 API Documentation

API documentation is available in Swagger UI:

### Local Development
```
http://localhost:3000/docs
```

### Production
```
https://vehicle-cms.onrender.com/docs
```

## 🚀 Deployment

The application is deployed on Render. You can access the production API at:
```
https://vehicle-cms.onrender.com
```

## 🎯 Best Practices

1. **Code**:
   - Follow SOLID principles
   - Implement DTOs for validation
   - Use decorators for common logic
   - Maintain naming consistency

2. **Database**:
   - Use migrations for schema changes
   - Implement appropriate indexes
   - Follow naming conventions
   - Maintain referential integrity

3. **Security**:
   - Never expose sensitive information
   - Validate all inputs
   - Implement appropriate logging
   - Keep dependencies updated

## 📖 Detailed Documentation

For more detailed documentation about the architecture, features, and system design, you can visit our documentation on DeepWiki:

[Complete Project Documentation](https://deepwiki.com/GhostemaneUrs/vehicle-cms/1-overview)
