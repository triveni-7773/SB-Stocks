# SB Stocks – Paper Trading Web Application

SB Stocks is a full-stack paper trading web application that allows users to register, log in, view available stocks, simulate buying and selling stocks, and track their portfolio without using real money.

> **Final Submission Branch:** `integration`

## Features

- User registration and login
- JWT-based authentication
- View available stocks
- Simulated stock buying and selling
- Portfolio tracking
- Transaction management
- Virtual buying power
- MongoDB database integration

## Tech Stack

### Frontend
- React.js
- Vite
- React Router
- Axios

### Backend
- Node.js
- Express.js
- JWT Authentication
- bcryptjs

### Database
- MongoDB Atlas
- Mongoose

## Project Structure

```text
SB-Stocks/
├── Database/
├── SB-Stocks-backened/
├── SB-Stocks-frontend/
│   └── frontend/
└── SB-Stocks-trading/
```

## Branch Structure

| Branch | Purpose |
|---|---|
| `frontend` | Frontend development |
| `backend` | Backend development |
| `database` | Database development |
| `trading` | Trading module development |
| `integration` | Final integrated and tested application |

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/triveni-7773/SB-Stocks.git
cd SB-Stocks

### 2. Configure environment variables

Create a `.env` file inside the `Database` folder.

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

> Do not upload the `.env` file to GitHub.

### 3. Install and run the backend

```bash
cd SB-Stocks-backened
npm install
node server.js
```

The backend runs on:

```text
http://localhost:5000
```

### 4. Seed sample stocks

From the backend folder:

```bash
node seedStocks.js
```

### 5. Install and run the frontend

Open another terminal:

```bash
cd SB-Stocks-frontend/frontend
npm install
npm run dev
```

Open the local URL displayed by Vite, usually:

```text
http://localhost:5173
```

## Application Flow

```text
Register → Login → Dashboard → View Stocks → Buy/Sell → Portfolio
```

## Important Notes

- Run `npm install` after cloning the repository.
- Never upload `node_modules` to GitHub.
- Never upload `.env` or database credentials.
- The `integration` branch contains the final integrated and tested application.

## Final Submission

The complete working project is available on the **`integration` branch**.
