# Team Task Manager Backend

A RESTful backend API for managing teams, members, and tasks with secure JWT-based authentication and role-based authorization. This project enables teams to collaborate efficiently by creating tasks, assigning members, and tracking task progress.

## Features

### Authentication & Authorization

* User Registration
* User Login
* JWT Authentication
* Protected Routes
* Role-Based Access Control (RBAC)
* Secure Password Hashing with bcrypt

### Team Management

* Create Teams
* View Teams
* Invite Members to Teams
* Remove Members from Teams
* Team Ownership Management

### Task Management

* Create Tasks
* Assign Tasks to Team Members
* Update Task Status
* View Team Tasks
* Delete Tasks
* Task Ownership Verification

### Security

* JWT Token Verification
* Protected API Endpoints
* Authorization Middleware
* Input Validation
* Secure Password Storage

## Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT (JSON Web Tokens)
* bcrypt
* Cookie Parser
* dotenv

## Project Structure

```text
src/
├── config/
│   └── db.js
├── controllers/
│   ├── auth.controller.js
│   ├── team.controller.js
│   └── task.controller.js
├── middleware/
│   ├── auth.middleware.js
│   └── authorize.midleware.js
|   └── team.middleware.js
├── models/
│   ├── user.model.js
│   ├── team.model.js
│   └── task.model.js
├── routes/
│   ├── auth.routes.js
│   ├── team.routes.js
│   └── task.routes.js
├── utils/
└── server.js
```

## Database Models

### User

```js
{
  name: String,
  email: String,
  password: String,
  role: String
}
```

### Team

```js
{
  name: String,
  owner: ObjectId,
  members: [ObjectId]
}
```

### Task

```js
{
  title: String,
  description: String,
  team: ObjectId,
  assignedTo: ObjectId,
  createdBy: ObjectId,
  status: String
}
```

## Installation

### Clone the Repository

```bash
git clone <repository-url>
cd team-task-manager-backend
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file in the root directory.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Start Development Server

```bash
npm run dev
```

### Start Production Server

```bash
npm start
```

## API Endpoints

### Authentication

| Method | Endpoint           | Description         |
| ------ | ------------------ | ------------------- |
| POST   | /api/auth/register | Register a new user |
| POST   | /api/auth/login    | Login user          |
| POST   | /api/auth/logout   | Logout user         |

### Teams

| Method | Endpoint                          | Description   |
| ------ | --------------------------------- | ------------- |
| GET    | /api/teams                        | Get all teams |
| POST   | /api/teams/create                 | Create a team |
| POST   | /api/teams/:teamId/invite         | Invite member |
| DELETE | /api/teams/:teamId/member/:userId | Remove member |

### Tasks

| Method | Endpoint                         | Description |
| ------ | -------------------------------- | ----------- |
| GET    | /api/teams/:teamId/tasks         | Get tasks   |
| POST   | /api/teams/:teamId/tasks/create  | Create task |
| PATCH  | /api/teams/:teamId/tasks/:taskId | Update task |
| DELETE | /api/teams/:teamId/tasks/:taskId | Delete task |

## Authorization Rules

### Team Owner / Admin

* Create teams
* Invite members
* Remove members
* Manage team tasks

### Team Member

* View team tasks
* Update assigned tasks
* Participate in team workflow

## Task Status Flow

```text
Pending
   ↓
In Progress
   ↓
Completed
```

## Author

- [Mann Jariwala](https://github.com/MJ-Enacton)

## License

This project is licensed under the MIT License.
