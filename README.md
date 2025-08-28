
````markdown
# FoodCartBackend

A backend service for the **FoodCart** application. This API provides the necessary endpoints to manage the food cart, including user authentication, menu management, order handling, and payment processing.

## Features

- **User Authentication:** User registration, login, and JWT-based authentication.
- **Menu Management:** Add, update, delete, and view available food items.
- **Order Management:** Place, update, and track orders.
- **Payment Integration:** Handle order payments.
- **Admin Dashboard:** Access and manage the food cart’s inventory and orders.

## Technologies Used

- **Node.js**: JavaScript runtime to build the backend.
- **Express.js**: Web framework to handle routing and API requests.
- **MongoDB**: NoSQL database to store user, food items, and orders data.
- **JWT (JSON Web Tokens)**: For user authentication.
- **Bcrypt.js**: To hash passwords securely.
- **Mongoose**: ODM (Object Data Modeling) for MongoDB.
- **dotenv**: Manage environment variables.

## Getting Started

To get a local copy of the project up and running, follow these steps:

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/en/) (v14 or later)
- [MongoDB](https://www.mongodb.com/try/download/community) (local setup or use MongoDB Atlas)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Pradhi11/FoodCartBackend.git
````

2. Navigate to the project directory:

   ```bash
   cd FoodCartBackend
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Set up environment variables:

   * Create a `.env` file in the root directory.
   * Add the following variables:

     ```
     MONGO_URI=your_mongo_connection_string
     JWT_SECRET=your_jwt_secret
     ```

5. Start the server:

   ```bash
   npm start
   ```

6. The backend should now be running at `http://localhost:5000`.

## API Endpoints

### Authentication

* **POST** `/api/auth/register`: Register a new user.
* **POST** `/api/auth/login`: Login an existing user.

### Menu

* **GET** `/api/menu`: Get all food items.
* **POST** `/api/menu`: Add a new food item (Admin only).
* **PUT** `/api/menu/:id`: Update an existing food item (Admin only).
* **DELETE** `/api/menu/:id`: Delete a food item (Admin only).

### Orders

* **POST** `/api/orders`: Place a new order.
* **GET** `/api/orders`: Get all orders (Admin only).
* **GET** `/api/orders/:id`: Get a specific order's details.

### Admin

* **GET** `/api/admin`: Access admin dashboard (Admin only).

## Testing

You can use tools like **Postman** or **Insomnia** to test the API endpoints. Make sure to pass the JWT token in the Authorization header as a Bearer token for protected routes.

## Contributing

If you'd like to contribute to this project, feel free to fork the repository and submit a pull request. Ensure that your code follows the project's coding standards and includes tests where applicable.

1. Fork the repo
2. Create a new branch (`git checkout -b feature-branch`)
3. Make your changes
4. Commit your changes (`git commit -am 'Add new feature'`)
5. Push to the branch (`git push origin feature-branch`)
6. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

````


