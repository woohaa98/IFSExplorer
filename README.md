# Parts of Me

A self-guided identity exploration tool inspired by Internal Family Systems (IFS).
Built with React. AI reflections powered by the Anthropic Claude API.

---

## Getting Started

### 1. Install dependencies
```bash
npm install
cd server && npm install
```

### 2. Set up the API key
Create a `.env` file in the project root:
```
REACT_APP_ANTHROPIC_KEY=your_api_key_here
REACT_APP_API_ENDPOINT=http://localhost:5000
```

### 3. Run locally

**Terminal 1 - Start the backend proxy (keeps API key secret):**
```bash
cd server
npm start
# Backend runs on http://localhost:5000
```

**Terminal 2 - Start the frontend:**
```bash
npm start
# Frontend opens at http://localhost:3000
```

The React app will communicate through the backend proxy, so your API key is never exposed to the browser.

### 4. Build for production
```bash
npm run build
```
Deploy the `/build` folder to Vercel, Netlify, or any static host.

For backend deployment instructions, see [SETUP_BACKEND.md](SETUP_BACKEND.md)

---

## Deploy to Vercel
1. Push this repo to GitHub
2. Go to vercel.com → New Project → Import repo
3. Add environment variable `REACT_APP_ANTHROPIC_KEY` in Vercel dashboard
4. Deploy — done

---

## Project Structure
```
parts-of-me/
├── public/
│   └── index.html
├── src/
│   ├── index.js       # React entry point
│   └── App.jsx        # Main application (all components)
├── package.json
└── README.md
```

---

## Important Notes
- This tool is **not therapy**. The safety disclaimer is built into Step 0.
- The Claude system prompt is inside `App.jsx` as `IFS_SYSTEM` — review before launch.
- Consider having a licensed counselor review the copy before public release.
