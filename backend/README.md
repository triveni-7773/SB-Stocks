# SB Stocks Backend

## Setup

1. Install Node.js and npm.
2. Open a terminal in this folder.
3. Run:

```bash
npm install
npm start
```

The server will run at:

```text
http://localhost:5000
```

## API Endpoints

- GET /
- POST /api/register
- POST /api/login
- GET /api/stocks
- POST /api/trade/buy
- POST /api/trade/sell
- GET /api/portfolio
- GET /api/portfolio/balance

## Notes

- The backend starts in demo mode if MongoDB is not available.
- To use MongoDB later, set MONGO_URI in the .env file.
