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

## 🏢 Multi-tenant Architecture

### Why Multi-tenant?

The system implements a multi-tenant architecture for several key reasons:

1. **Data Isolation**: Each tenant has its own database schema, ensuring complete data separation between organizations
2. **Scalability**: Handles multiple organizations in a single application instance, optimizing resources
3. **Customization**: Each tenant can have its own configurations and data without affecting others

### Tenant Management

#### Creating a New Tenant

1. **Initial Setup**:
   ```bash
   # Create new tenant
   POST /tenancy
   {
     "name": "new-tenant"
   }

   # Run migrations for the new tenant
   npm run db:migrate

   # Run necessary seeds
   npm run db:seed-roles
   ```

2. **Automatic Process**:
   - Creates new record in `tenancy` table
   - Generates new database schema (`t_[name]`)
   - Runs migrations to create required tables
   - Initializes data with seeds

#### Request Handling

- All requests must include `x-tenant-id` header
- Default tenant is "moradela"
- Middleware validates tenant existence and sets correct database connection
- Tenant context is injected into each request

### Authentication System

1. **Token Types**:
   - Access Token: Short-lived JWT (900s default)
   - Refresh Token: Long-lived token (7 days default)

2. **Security Features**:
   - Separate signing secrets for each token type
   - Rate limiting protection
   - Helmet security headers
   - Tenant-specific token validation

### Database Structure

1. **Public Schema**:
   - Contains `tenancy` table with tenant information
   - Globally accessible

2. **Tenant Schemas**:
   - Each tenant has dedicated schema (`t_[name]`)
   - Contains tenant-specific tables:
     - Users
     - Roles
     - Permissions
     - Projects
     - Organizational Units
     - Vehicles
     - Transfers

### Best Practices

1. **Validation**:
   - Input validation with class-validator
   - DTOs for data integrity

2. **Auditing**:
   - Operation traceability
   - Tenant-specific activity logging

3. **Error Handling**:
   - Tenant-specific error messages
   - Clear and descriptive error responses

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

### Importing to Postman

1. **Access Swagger JSON**:
   - Local: `http://localhost:3000/docs-json`
   - Production: `https://vehicle-cms.onrender.com/docs-json`

2. **Import to Postman**:
   - Open Postman
   - Click "Import" button
   - Select "Link" tab
   - Paste the Swagger JSON URL
   - Click "Continue" and then "Import"

3. **Postman Environment Setup**:
   - Create a new environment
   - Add these variables:
     ```
     base_url: http://localhost:3000 (or production URL)
     x-tenant-id: moradela
     ```
   - Save the environment and select it

4. **Authentication**:
   - After login, copy the access token
   - In Postman, go to the "Authorization" tab
   - Select "Bearer Token"
   - Paste the token in the "Token" field

5. **Making Requests**:
   - All requests will automatically include:
     - The `x-tenant-id` header
     - The Bearer token (if authenticated)
   - You can now test all API endpoints

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
