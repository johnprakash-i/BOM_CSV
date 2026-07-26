# User Authentication & Authorization API

Node.js REST API for user registration, login, and protected profile access using **Bearer JWT** tokens. Built with Express.js, Mongoose, and MongoDB, following the **MVC** pattern.

## Features

- User registration with hashed passwords (bcrypt)
- Login with JWT generation
- Protected route middleware (`Authorization: Bearer <token>`)
- Input validation and structured error responses
- Postman collection with sample requests and responses

## Tech Stack

| Technology   | Purpose                          |
|--------------|----------------------------------|
| Node.js      | Runtime                          |
| Express.js   | Web framework                    |
| Mongoose     | MongoDB ODM                      |
| JWT          | Bearer token auth                |
| bcryptjs     | Password hashing                 |
| express-validator | Request validation          |
| Postman      | API documentation & testing      |

## Project Structure

```
authentication/
├── config/
│   └── db.js                 # MongoDB connection
├── controllers/
│   └── authController.js     # Register, login, getMe
├── middleware/
│   ├── authMiddleware.js     # JWT verification
│   └── validate.js           # Input validation rules
├── models/
│   └── User.js               # User schema
├── routes/
│   └── authRoutes.js         # Auth routes
├── views/
│   └── index.html            # Simple landing page
├── postman/
│   └── Authentication_API.postman_collection.json
├── .env.example
├── package.json
├── server.js
└── README.md
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) running locally (or a MongoDB Atlas URI)
- [Postman](https://www.postman.com/) (optional, for API testing)

## Setup

1. **Clone / open the project** and install dependencies:

```bash
npm install
```

2. **Configure environment variables**

Copy the example file and edit values as needed:

```bash
cp .env.example .env
```

| Variable         | Description                          | Default                                      |
|------------------|--------------------------------------|----------------------------------------------|
| `PORT`           | Server port                          | `3000`                                       |
| `MONGODB_URI`    | MongoDB connection string            | `mongodb://127.0.0.1:27017/authentication`   |
| `JWT_SECRET`     | Secret key for signing tokens        | *(change in production)*                     |
| `JWT_EXPIRES_IN` | Token lifetime                       | `1d`                                         |

3. **Start MongoDB** (if running locally).

4. **Run the server**:

```bash
npm start
# or with auto-reload:
npm run dev
```

Server listens at `http://localhost:3000`.

## API Endpoints

### 1. Register User

`POST /api/auth/register`

**Request body:**

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Success — `201 Created`:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "...",
    "username": "johndoe",
    "email": "john@example.com",
    "createdAt": "..."
  }
}
```

### 2. Login

`POST /api/auth/login`

**Request body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success — `200 OK`:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "user": {
      "id": "...",
      "username": "johndoe",
      "email": "john@example.com"
    }
  }
}
```

### 3. Get Current User (Protected)

`GET /api/auth/me`

**Headers:**

```
Authorization: Bearer <your_jwt_token>
```

**Success — `200 OK`:**

```json
{
  "success": true,
  "message": "User information retrieved successfully",
  "data": {
    "id": "...",
    "username": "johndoe",
    "email": "john@example.com",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

## Postman

1. Open Postman → **Import** → select `postman/Authentication_API.postman_collection.json`
2. Run **Register User**, then **Login User** (the JWT is saved to `authToken` automatically)
3. Run **Get Current User** — it uses the saved Bearer token

Each request in the collection includes detailed descriptions and example success/error responses.

## Authentication Flow

```
Register → Login → Receive JWT → Send Bearer token on protected routes
```

1. Client registers with username, email, and password
2. Password is hashed with bcrypt and stored in MongoDB
3. Client logs in; server verifies credentials and returns a signed JWT
4. Client sends `Authorization: Bearer <token>` on protected requests
5. Middleware verifies the token, loads the user, and attaches `req.user`

## License

ISC
