# VAAD HR Backend

A scalable Human Resource Management (HRM) backend built with **Node.js**, **Express.js**, **TypeScript**, **Prisma ORM**, and **PostgreSQL**. The API provides secure authentication, employee management, department management, leave management, and document handling through a clean, modular REST architecture.

---

## Overview

VAAD HR Backend serves as the REST API powering the VAAD HR platform. It is designed with scalability, maintainability, and security in mind, following modern backend development practices.

The application implements authentication, role-based authorization, request validation, centralized error handling, and cloud file storage to support enterprise HR workflows.

---

## Features

### Authentication & Authorization

- JWT Authentication
- Secure Login
- Protected Routes
- Role-Based Access Control (RBAC)
- User Profile

### Employee Management

- Create Employee
- Update Employee
- Delete Employee
- View Employee Details
- Employee Search
- Employee Status Management

### Department Management

- Create Department
- Update Department
- Delete Department
- Assign Employees to Departments

### Leave Management

- Leave Types
- Leave Requests
- Leave Approval Workflow
- Leave Balance Tracking

### Document Management

- Upload Employee Documents
- AWS S3 Cloud Storage
- Presigned URL Support
- Document Verification

### API Documentation

- Interactive Swagger (OpenAPI) Documentation
- Request & Response Schemas
- Endpoint Testing
- Authorization Support

### General

- RESTful API Architecture
- Prisma ORM
- PostgreSQL
- Request Validation with Zod
- Centralized Error Handling
- Environment-Based Configuration
- Modular Folder Structure

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js | JavaScript Runtime |
| Express.js | Backend Framework |
| TypeScript | Static Typing |
| Prisma ORM | Database ORM |
| PostgreSQL | Relational Database |
| JWT | Authentication |
| Zod | Request Validation |
| bcrypt | Password Hashing |
| Multer | File Upload Handling |
| AWS S3 | Cloud Storage |
| Swagger (OpenAPI) | API Documentation |
| dotenv | Environment Variables |

---

## Project Structure

```text
src/
│
├── config/
├── middleware/
├── prisma/
├── modules/
├── migrations/
├── jobs/
├── utils/
├── docs/
├── errors/
├── app.ts
└── server.ts
```

---

## Getting Started

### Clone Repository

```bash
git clone https://github.com/yourusername/vaad-hr-backend.git

cd vaad-hr-backend
```

---

## Install Dependencies

Using pnpm

```bash
pnpm install
```

---

## Environment Variables

Create a `.env` file in the project root.

```env
PORT=4000

DATABASE_URL=postgresql://username:password@localhost:5432/hr_platform

JWT_SECRET=your_jwt_secret

JWT_EXPIRES_IN=7d

AWS_ACCESS_KEY_ID=your_access_key

AWS_SECRET_ACCESS_KEY=your_secret_key

AWS_REGION=your_region

AWS_BUCKET_NAME=your_bucket_name
```

---

## Database Setup

Generate Prisma Client

```bash
pnpm prisma generate
```

Run Migrations

```bash
pnpm prisma migrate dev
```

Seed Database (Optional)

```bash
pnpm prisma db seed
```

---

## Running the Application

Development

```bash
pnpm dev
```

Build

```bash
pnpm build
```

Start Production

```bash
pnpm start
```

---

## Authentication

Protected endpoints require a valid JWT access token.

Include the token in the Authorization header.

```http
Authorization: Bearer <your_access_token>
```

---

## User Roles

The API supports role-based authorization.

Available roles include:

- Admin
- HR
- Manager
- Employee

Access to protected resources is controlled based on user roles.

---

## API Documentation

Interactive API documentation is available through **Swagger UI**.

After starting the server, open:

```text
http://localhost:4000/api-docs
```

Swagger provides:

- Endpoint Documentation
- Request Examples
- Response Examples
- Authentication Testing
- Interactive API Explorer

---

## API Modules

- Authentication
- Employees
- Departments
- Leave Types
- Leave Requests
- Leave Balances
- Documents
- User Profile

---

## Request Validation

Incoming requests are validated using **Zod**, ensuring data integrity before reaching the business logic layer.

---

## Error Handling

The application uses centralized error handling to provide consistent API responses.

Example:

```json
{
  "success": false,
  "message": "Employee not found"
}
```

---

## File Storage

Employee documents are securely stored using **Amazon S3**, with support for presigned URLs to enable secure uploads and downloads.

---

## Security

- JWT Authentication
- Password Hashing with bcrypt
- Role-Based Authorization
- Protected Routes
- Request Validation
- Environment Variable Management
- Secure Cloud File Storage

---

## Testing

API endpoints have been manually tested using **Swagger UI** throughout development to verify authentication, authorization, validation, and business logic.

Automated unit and integration testing using **Jest** and **Supertest** are planned for future releases.

---

## Future Improvements

- Refresh Token Authentication
- Automated Unit Testing (Jest)
- Integration Testing (Supertest)
- Attendance Management
- Payroll Module
- Performance Reviews
- Recruitment Module
- Email Notifications
- Audit Logs

---

## Contributing

Contributions, suggestions, and improvements are welcome. Please open an issue or submit a pull request for proposed changes.

---

## License

This project is licensed under the MIT License.

---

## Author

**Atilola Victor Oyewole**

Full Stack Developer

- Portfolio: https://nobledevstudio.netlify.app
- GitHub: https://github.com/your-github-username
- LinkedIn: https://linkedin.com/in/your-linkedin-profile