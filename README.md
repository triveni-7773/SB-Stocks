# SB Stocks Project

## Backend setup instructions

### 1. Install Node.js
Make sure Node.js and npm are installed on your computer.

### 2. Open the backend folder
```powershell
cd backend
```

### 3. Install dependencies
```powershell
npm install
```

If npm is not recognized on Windows, use:
```powershell
& "C:\Program Files\nodejs\npm.cmd" install
```

### 4. Start the backend
```powershell
npm start
```

Or on Windows:
```powershell
& "C:\Program Files\nodejs\npm.cmd" start
```

You can also run the helper file:
```powershell
start.bat
```

### 5. Test the backend
Open your browser or use a tool like Postman to visit:
- http://localhost:5000/

### 6. Main API endpoints
- POST /register
- POST /login
- GET /stocks
- POST /buy
- POST /sell
- GET /portfolio

### 7. Notes for beginners
- Do not upload the node_modules folder to GitHub.
- Do not upload your .env file.
- Run npm install first after cloning the project.

## GitHub workflow
If you are working on your own branch:
```powershell
git checkout -b backend
git add .
git commit -m "Initial backend setup"
git push -u origin backend
```
