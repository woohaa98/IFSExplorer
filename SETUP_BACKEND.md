# Getting Started with Backend Proxy

## Development Setup

### 1. Install dependencies
```bash
npm install
cd server && npm install
```

### 2. Run both frontend and backend

**Terminal 1 - Start the backend server:**
```bash
cd server
npm start
# or with auto-reload:
npm run dev
```
Server runs on `http://localhost:5000`

**Terminal 2 - Start the React frontend:**
```bash
npm start
```
Frontend runs on `http://localhost:3000`

### 3. How it works
- React frontend calls `http://localhost:5000/api/chat` (defined in `.env` as `REACT_APP_API_ENDPOINT`)
- Backend proxy receives the request and forwards it to Anthropic's API with the API key (kept secret on the server)
- Response is sent back to the frontend

## Production Deployment

### Backend (e.g., Railway, Heroku, AWS)
1. Deploy the `/server` folder
2. Set environment variable: `REACT_APP_ANTHROPIC_KEY=your_actual_key`
3. Get your deployed server URL (e.g., `https://parts-of-me-server.railway.app`)

### Frontend (e.g., Vercel, Netlify)
1. Deploy the React app (points to `/` folder, ignore `/server`)
2. Set environment variable: `REACT_APP_API_ENDPOINT=https://parts-of-me-server.railway.app`

## Security Benefits
✅ API key stays on the server - never exposed in browser  
✅ Frontend can be deployed as static files  
✅ Backend can scale independently  
✅ CORS handled on the server side
