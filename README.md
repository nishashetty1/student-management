# Student Management System

A backend API built using Node.js, Express, and MongoDB for managing student records with authentication and token-based access.

## 🚀 Features

- Student, Courses CRUD operations  
- Token-based authentication (JWT)  
- Role-based access control  
- MongoDB database integration

---

## 🛠️ Setup & Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/nishashetty1/student-management.git
   cd backend
   ```
2. **Install dependencies:**

   ```bash
   npm install
   ```
3. **Set up environment variables:**
   Create a `.env` file in the root directory and configure it as per the section below.
4. **Start the server:**
   ```bash
   npm start
   ```
   The server will run at `http://localhost:3000` by default.

---

## ⚙️ Environment Variable Configuration
Create a `.env` file in the root directory with the following variables:
```bash
PORT=3000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/studentManagement?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
```
🔒 Use strong secrets and never commit your `.env` file to version control.
---

## 📡 API Routes Documentation

#### Base URL
- `http://localhost:3000`
  
### Authentication Routes
| Method | Endpoint                | Description         | Request Body                    | Response                        |
|--------|-------------------------|---------------------|---------------------------------|---------------------------------|
| POST   | `/api/v1/auth/register` | Register a new user | { name, email, password }       | { success, token, user }        |
| POST   | `/api/v1/auth/login `   | Login a user        | { email, password }             | { success, token, user }        |

### Student Routes
| Method | Endpoint                           | Description                    | Request Body / Params                                       | Response                        |
|--------|------------------------------------|--------------------------------|-------------------------------------------------------------|----------------------------------|
| GET    | `/api/v1/students`                 | Get all students               | Query params: page, limit, department                        | { success, count, pagination, data } |
| GET    | `/api/v1/students/:id`             | Get a single student           | Path param: id                                               | { success, data }              |
| POST   | `/api/v1/students`                 | Create a new student           | { name, email, age, department, enrolledCourses }            | { success, data }              |
| PUT    | `/api/v1/students/:id`             | Update a student               | { name, email, age, department, enrolledCourses }            | { success, data }              |
| DELETE | `/api/v1/students/:id`             | Delete a student               | Path param: id                                               | { success, data }              |
| PUT    | `/api/v1/students/:id/enroll`      | Enroll student in courses      | { courseIds: [id1, id2, ...] }                               | { success, data }              |
| PUT    | `/api/v1/students/:id/unenroll`    | Unenroll student from courses  | { courseIds: [id1, id2, ...] }                               | { success, data }              |

### Course Routes
| Method | Endpoint               | Description           | Request Body / Params                   | Response                  |
|--------|------------------------|-----------------------|------------------------------------------|---------------------------|
| GET    | `/api/v1/courses`      | Get all courses       | Query param: title (optional)           | { success, count, data }  |
| GET    | `/api/v1/courses/:id`  | Get a single course   | Path param: id                           | { success, data }         |
| POST   | `/api/v1/courses`      | Create a new course   | { title, description, credits }          | { success, data }         |
| PUT    | `/api/v1/courses/:id`  | Update a course       | { title, description, credits }          | { success, data }         |
| DELETE | `/api/v1/courses/:id`  | Delete a course       | Path param: id                           | { success, data }         |

### Dashboard Routes
| Method | Endpoint         | Description             | Request Body | Response                                                                  |
|--------|------------------|-------------------------|--------------|---------------------------------------------------------------------------|
| GET    | `/api/v1/dashboard`| Get dashboard statistics| None         | { success, data: { studentCount, courseCount, departmentCount, recentStudents } } |


## Authentication Usage Guide

1. Registration
   - Send a POST request to `/api/v1/auth/register` with the following body:
     ```bash
        {
         "name": "Admin User",
         "email": "admin@example.com",
         "password": "password123"
        }
    ```
  - If successful, you will receive a response containing a JWT token and user information:
    ```bash
    {
    "success": "true",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "60d0fe4f5311236168a109ca",
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "admin",
      "createdAt": "2023-06-08T08:30:00.000Z"
       }
    }
    ```
2. Login
   - Send a POST request to `/api/v1/auth/login` with the following body:
     ```bash
     {
      "email": "admin@example.com",
      "password": "password123"
     }
     ```
   - If successful, you will receive a response containing a JWT token and user information (same format as registration response).
3. Using the Authentication Token
   - For all protected routes, include the JWT token in the Authorization header:
     ```bash
     Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     ```

### Testing the APIs using Postman
1. Login at `/api/auth/login`
2. Copy the token
3. Set `Authorization: Bearer <token>` in your headers
4. Access protected student, courses endpoints
