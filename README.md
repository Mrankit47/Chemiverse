# ChemiVerse — Immersive 3D Chemistry Learning Universe

ChemiVerse is a premium, futuristic, and cinematic 3D chemistry learning platform. It is modeled after [biosphere-eatr.vercel.app](https://biosphere-eatr.vercel.app), offering immersive 3D simulations, interactive Bohr model representations, molecule viewers, a reaction simulator, virtual labs, quiz arenas, and an AI-powered chemistry tutor (ChemiBot).

---

## Architecture & Technology Stack

- **Frontend**: React 19 + React Router v7 + React Three Fiber (`three`, `@react-three/fiber`, `@react-three/drei`) + Tailwind CSS + Framer Motion + GSAP + Lenis smooth scroll + Lucide icons
- **Backend**: FastAPI + MongoDB (via Motor async driver) + `emergentintegrations` LLM client for Claude 3.5 Sonnet
- **Styling & Aesthetics**: Lab/space space theme, utilizing neon cyan (`#00F5FF`), electric purple (`#8A2BE2`), and chemical orange (`#FF6B00`) on a dark workspace background (`#050816`).

---

## Prerequisites

Before starting, ensure you have the following installed on your system:
- **Node.js** (v18.0.0 or higher; v24+ recommended) and **npm** or **yarn**
- **Python** (v3.10 or higher; v3.11 recommended)
- **MongoDB** (running locally on port `27017` or accessible via a URI)

---

## Getting Started

### 1. MongoDB Setup
Ensure MongoDB is running locally. If it is not running as a background service, start it:
```bash
# On Windows, you can start the MongoDB service via PowerShell:
Start-Service -Name MongoDB

# Or run the daemon directly if it's on your PATH:
mongod --dbpath <path_to_db_folder>
```
Make sure you create a database named `chemiverse` (or set it in the backend environment variables).

---

### 2. Backend Setup
1. Open a terminal and navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Create a Python virtual environment:
   ```bash
   python -m venv venv
   ```
3. Activate the virtual environment:
   - **Windows (PowerShell)**:
     ```powershell
     .\venv\Scripts\Activate.ps1
     ```
   - **Windows (CMD)**:
     ```cmd
     .\venv\Scripts\activate.bat
     ```
   - **Linux / macOS**:
     ```bash
     source venv/bin/activate
     ```
4. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. Configure environment variables:
   - Copy `.env.example` to `.env`:
     ```bash
     copy .env.example .env
     ```
   - Open `.env` and fill in the environment variables:
     - `MONGO_URL`: Your MongoDB connection URL (default: `mongodb://localhost:27017`).
     - `DB_NAME`: The MongoDB database name (default: `chemiverse`).
     - `EMERGENT_LLM_KEY`: Your Emergent LLM API key for the AI Tutor (required for the streaming chat features).
     - `CORS_ORIGINS`: Allowed origins (default: `http://localhost:3000`).

6. Run the FastAPI development server:
   ```bash
   uvicorn server:app --reload --port 8000
   ```
   The backend API will be available at [http://localhost:8000](http://localhost:8000) (API documentation at `http://localhost:8000/docs`).

---

### 3. Frontend Setup
1. Open a new terminal and navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies (recommended using `npm` or `yarn`):
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Copy `.env.example` to `.env`:
     ```bash
     copy .env.example .env
     ```
   - Open `.env` and configure:
     - `REACT_APP_BACKEND_URL`: The URL where the FastAPI backend is running (default: `http://localhost:8000`).
4. Run the React development server:
   ```bash
   npm start
   ```
   The web application will open automatically at [http://localhost:3000](http://localhost:3000).

---

## Running Tests

### Backend API Tests
To run backend integration and unit tests, ensure the backend server is running, then run `pytest` inside the activated virtual environment in the `backend/` folder:

```bash
cd backend
pytest
```

> [!NOTE]
> The backend tests require `pytest-xdist` (already specified in `requirements.txt`) and run on 2 parallel workers by default as configured in `pytest.ini`.

---

## Troubleshooting

- **FastAPI shows "LLM key not configured"**:
  Make sure you have populated `EMERGENT_LLM_KEY` in `backend/.env`.
- **CORS Errors on Frontend**:
  Verify that the backend's `CORS_ORIGINS` includes the port/URL of the frontend (normally `http://localhost:3000`).
- **Cannot connect to MongoDB**:
  Ensure the MongoDB server is running and the `MONGO_URL` in `backend/.env` points to the correct address.
