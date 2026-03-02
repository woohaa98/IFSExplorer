# Parts of Me

A self-guided identity exploration tool inspired by Internal Family Systems (IFS).
Built with React. AI reflections powered by the Anthropic Claude API.

---

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Set up the API key
This app calls the Anthropic API directly from the browser.
The API key is currently handled by the Claude.ai artifact environment.

For production deployment, you have two options:

**Option A — Environment variable (recommended)**
Create a `.env` file in the project root:
```
REACT_APP_ANTHROPIC_KEY=your_api_key_here
```
Then update the `askClaude` function in `src/App.jsx` to use:
```js
headers: {
  "Content-Type": "application/json",
  "x-api-key": process.env.REACT_APP_ANTHROPIC_KEY,
  "anthropic-version": "2023-06-01",
  "anthropic-dangerous-direct-browser-access": "true",
}
```

**Option B — Backend proxy (most secure)**
Create a small Express/Next.js API route that holds the key server-side
and proxies requests to Anthropic. Recommended before public launch.

### 3. Run locally
```bash
npm start
```
Opens at `http://localhost:3000`

### 4. Build for production
```bash
npm run build
```
Deploy the `/build` folder to Vercel, Netlify, or any static host.

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
