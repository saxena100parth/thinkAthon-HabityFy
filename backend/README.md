# Backend - MERN Authentication Boilerplate

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   - Copy `env.example` to `.env`
   - Update the following variables:
     - `MONGODB_URI`: Your MongoDB Atlas connection string
     - `JWT_SECRET`: A secure secret key for JWT signing
     - `PORT`: Server port (default: 5000)

3. **Run the server:**
   ```bash
   # Development mode with auto-restart
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

### Authentication

- **POST** `/api/auth/signup`
  - Body: `{ name, email, password }`
  - Returns: JWT token and user info

- **POST** `/api/auth/login`
  - Body: `{ email, password }`
  - Returns: JWT token and user info

## Protected Routes

To protect any route, import and use the `protect` middleware:

```javascript
const { protect } = require('./middleware/auth');

router.get('/protected-route', protect, (req, res) => {
  // req.user contains the authenticated user
  res.json({ user: req.user });
});
```

## Project Structure

```
backend/
├── controllers/    # Route controllers
├── middleware/     # Custom middleware (auth, etc.)
├── models/         # Mongoose models
├── routes/         # API routes
├── server.js       # Main server file
└── .env            # Environment variables (create from env.example)
```
