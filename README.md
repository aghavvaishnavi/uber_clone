# 🚗 Uber Clone

A full-stack Uber Clone built using the MERN stack. This project replicates the basic functionality of Uber, allowing users to book rides and captains to accept ride requests. It was built to learn full-stack web development, authentication, APIs, and real-time communication.

## Features

- User and Captain authentication
- Book and accept rides
- Google Maps location search
- Real-time ride updates using Socket.io
- JWT-based authentication
- Responsive user interface

## Tech Stack

- React.js
- Node.js
- Express.js
- MongoDB
- Socket.io
- Google Maps API
- JWT Authentication

## Getting Started

### Clone the repository

```bash
git clone <repository-url>
```

### Install dependencies

Backend:

```bash
cd backend
npm install
```

Frontend:

```bash
cd frontend
npm install
```

### Environment Variables

Create a `.env` file inside the backend folder.

```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### Run the project

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

Open `http://localhost:3000` in your browser.

## What I Learned

- Building REST APIs with Express
- User authentication using JWT
- Working with MongoDB
- Real-time communication using Socket.io
- Integrating Google Maps API
- Managing frontend and backend together in a MERN application

## Author

**Vaishnavi Aghav**
