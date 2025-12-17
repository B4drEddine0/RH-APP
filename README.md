# Mini HR Web Application

A full-stack HR management system built with Next.js, MySQL, and TypeScript.

## Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin/Employee)
- Secure password hashing with bcrypt

### Employee Management (Admin Only)
- Create, edit, and delete employees
- Employee search and pagination
- Profile management with personal and job information

### Time Off Management
- Employee time off request submission
- Admin approval/rejection workflow
- Request status tracking and history

### Evaluations & Scoring
- Predefined evaluations (Bookkeeping, VAT, Toolbox, Yearwork)
- Score buckets: 0-30, 31-50, 51-70, 71-100
- Admin reporting dashboard with user count per bucket

### Training & Courses
- Course creation and management (Admin)
- Employee course enrollment
- Course cards with enrollment tracking

### Data Export
- CSV export for employees list
- CSV export for time off requests
- Admin-only access to exports

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: MySQL
- **Authentication**: JWT, bcrypt
- **Styling**: Tailwind CSS

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- MySQL server running
- Git

### 1. Clone and Install Dependencies

```bash
cd mini-rh-app
npm install
```

### 2. Database Setup

1. Create MySQL database:
```sql
CREATE DATABASE mini_hr_db;
```

2. Run the schema:
```bash
mysql -u root -p mini_hr_db < database/schema.sql
```

3. Insert seed data:
```bash
mysql -u root -p mini_hr_db < database/seed.sql
```

### 3. Environment Configuration

Update `.env.local` with your database credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=mini_hr_db
DB_PORT=3306
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NEXTAUTH_URL=http://localhost:3000
```

### 4. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Demo Accounts

### Admin Account
- Email: `admin@marabes.nl`
- Password: `admin123`

### Employee Accounts
- Email: `nabil@marabes.nl` | Password: `employee123`
- Email: `jane@marabes.nl` | Password: `employee123`
- Email: `mike@marabes.nl` | Password: `employee123`

## API Documentation

### Authentication Endpoints

#### POST /api/auth/login
Login with email and password
```json
{
  "email": "admin@marabes.nl",
  "password": "admin123"
}
```

Response:
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "Badr Eddine",
    "email": "admin@marabes.nl",
    "role": "admin"
  }
}
```

#### GET /api/auth/me
Get current user profile (requires Authorization header)

### Employee Endpoints

#### GET /api/employees
Get employees list with search and pagination
- Query params: `search`, `page`, `limit`
- Admin access required

#### POST /api/employees
Create new employee (Admin only)
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "employee",
  "job_position": "Developer",
  "birthday": "1990-01-01",
  "date_hired": "2024-01-01"
}
```

### Time Off Endpoints

#### GET /api/timeoff
Get time off requests
- Admin: All requests
- Employee: Own requests only

#### POST /api/timeoff
Create time off request
```json
{
  "start_date": "2024-01-15",
  "end_date": "2024-01-19",
  "reason": "Annual vacation"
}
```

#### PUT /api/timeoff/[id]
Approve/reject time off request (Admin only)
```json
{
  "status": "approved",
  "admin_note": "Approved for vacation"
}
```

### Course Endpoints

#### GET /api/courses
Get all courses with enrollment data

#### POST /api/courses
Create new course (Admin only)
```json
{
  "title": "Excel Training",
  "description": "Advanced Excel skills",
  "image_url": "https://example.com/image.jpg"
}
```

#### POST /api/courses/enroll
Enroll in course
```json
{
  "course_id": 1
}
```

### Evaluation Endpoints

#### GET /api/evaluations
Get evaluations
- Admin: All evaluations with score statistics
- Employee: Personal scores only

#### POST /api/evaluations
Assign score to employee (Admin only)
```json
{
  "user_id": 2,
  "evaluation_id": 1,
  "score": 85
}
```

### Export Endpoints

#### GET /api/export/employees
Export employees to CSV (Admin only)

#### GET /api/export/timeoff
Export time off requests to CSV (Admin only)

## Project Structure

```
mini-rh-app/
├── components/          # React components
│   └── Layout.tsx      # Main layout component
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication context
├── database/           # Database files
│   ├── schema.sql     # Database schema
│   └── seed.sql       # Seed data
├── lib/               # Utility functions
│   ├── auth.ts        # Authentication utilities
│   └── db.ts          # Database connection
├── pages/             # Next.js pages
│   ├── api/           # API routes
│   ├── dashboard.tsx  # Main dashboard
│   ├── employees.tsx  # Employee management
│   ├── timeoff.tsx    # Time off requests
│   ├── courses.tsx    # Course management
│   ├── evaluations.tsx # Evaluations
│   ├── reports.tsx    # Reports & exports
│   ├── login.tsx      # Login page
│   └── index.tsx      # Home page
└── styles/            # CSS styles
    └── globals.css    # Global styles
```

## Development

### Code Quality
- ESLint configured for code linting
- TypeScript for type safety
- Tailwind CSS for consistent styling

### Deployment
The application can be deployed to platforms like Vercel, Netlify, or any Node.js hosting service.

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- SQL injection prevention with parameterized queries
- Input validation and sanitization

