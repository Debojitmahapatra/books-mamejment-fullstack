# Book Management Fullstack Application

A comprehensive full-stack book management system that allows users to create accounts, list books for sale, manage their own book inventory, and leave/manage reviews on books. Built with Node.js/Express backend and React frontend, using MongoDB as the database.

## Features

- **User Authentication & Authorization**: Secure JWT-based authentication with user registration and login
- **Book Management**: Create, read, update, and delete books with ownership validation
- **Review System**: Add, update, and delete reviews with rating system (1-5 stars)
- **Search Functionality**: Search books by title, category, or price
- **User Profiles**: View personal information, owned books, and reviews
- **Responsive UI**: Bootstrap-based responsive design for mobile and desktop
- **Soft Deletion**: Books and reviews are soft-deleted to maintain data integrity
- **Input Validation**: Comprehensive validation on both frontend and backend

## Tech Stack

### Backend
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ORM
- **JWT (jsonwebtoken)** - Authentication & authorization
- **Multer** - File upload handling
- **AWS-SDK** - Cloud services integration
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 18.2** - UI library
- **React Router DOM** - Client-side routing
- **React Bootstrap** - UI components
- **JWT-decode** - JWT token handling
- **React Multi-Carousel** - Carousel component

## Project Structure

```
books-mamejment-fullstack/
├── books-mamejment-fullstack/     # Backend
│   ├── src/
│   │   ├── index.js              # Server entry point
│   │   ├── Controllers/          # Business logic
│   │   ├── Models/               # Mongoose schemas
│   │   ├── route/                # API routes
│   │   ├── middlware/            # Authentication middleware
│   │   └── vaildator/            # Input validation
│   └── package.json
│
├── frontend/
│   └── books-mamejment-fullstack/ # Frontend
│       ├── src/
│       │   ├── App.js            # Main router
│       │   ├── components/       # React components
│       │   └── ...
│       └── package.json
│
└── README.md                     # This file
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd books-mamejment-fullstack
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   PORT=3001
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend/books-mamejment-fullstack
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000` for frontend and `http://localhost:3001` for backend API.

## Usage

### User Registration & Login
- Visit the signup page to create a new account
- Login with your credentials to access the application
- JWT tokens are stored locally for session management

### Managing Books
- **Add Book**: Use the "Add Product" page to list a new book for sale
- **View Books**: Browse all available books or search by title/category
- **My Books**: View and manage books you've listed
- **Update/Delete**: Edit or remove your own book listings

### Reviews
- **Add Review**: Leave reviews with ratings (1-5 stars) on any book
- **View Reviews**: See all reviews for a specific book
- **Manage Reviews**: Update or delete your own reviews

## API Documentation

### Authentication Endpoints
- `POST /register` - Register new user
- `POST /login` - User login

### Book Endpoints
- `POST /books` - Create a new book
- `GET /books` - Get all books (with optional filters)
- `GET /books/:bookId` - Get book details with reviews
- `PUT /books/:bookId` - Update book
- `DELETE /books/:bookId` - Delete book
- `GET /searchbooks/:key` - Search books
- `GET /myBooks` - Get user's books

### Review Endpoints
- `POST /books/:bookId/review` - Add review
- `PUT /books/:bookId/review/:reviewId` - Update review
- `DELETE /books/:bookId/review/:reviewId` - Delete review
- `GET /getbooks/:bookId/review` - Get book reviews
- `GET /getreview/:userId/review` - Get user's reviews

## Database Models

### User
- Personal information (name, email, phone, address)
- Authentication data (password hash)
- Profile image

### Book
- Book details (title, excerpt, ISBN, category, price)
- Ownership (userId)
- Review count and metadata
- Soft deletion support

### Review
- Book reference and reviewer info
- Rating (1-5) and review text
- Denormalized book data for quick display

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
