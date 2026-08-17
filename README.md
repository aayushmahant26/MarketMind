# MarketMind: AI-Powered Market & Financial Analysis Platform

MarketMind is an advanced financial and stock market analysis platform built using a multi-agent system powered by LangGraph and Django, coupled with a responsive React + Vite frontend. It features automatic routing of analysis requests to specialized technical, news, and risk agents.

---

## 🏗️ Project Architecture

The project is structured as a monorepo consisting of a Django REST Framework backend and a React (Vite) frontend:

```text
Market Experiment/
├── backend/            # Django REST API & LangGraph Agents
│   ├── core/           # Main project settings & URLs
│   ├── agents/         # LangGraph workflow (Supervisor, News, Risk, State)
│   ├── stocks/         # Stock endpoints & services
│   ├── watchlist/      # Watchlist management
│   ├── reports/        # Financial reports and exports
│   ├── accounts/       # User registration, login, and JWT auth
│   └── db.sqlite3      # Local database (ignored in git)
├── frontend/           # React + Vite client application
│   ├── src/            # Source code (components, pages, context, hooks)
│   ├── public/         # Static assets
│   └── package.json    # Frontend dependencies and scripts
└── venv/               # Root virtual environment (ignored in git)
```

---

## 🤖 Multi-Agent Workflow (LangGraph)

The platform runs queries through a stateful multi-agent graph system in the backend:
1. **Supervisor Agent**: Parses the user's natural language query and routes it. Based on query classification, it decides whether to run specialized downstream agents or skip them to maximize efficiency.
2. **Technical Analyzers**: Processes technical stock metrics (RSI, MACD, EMA, SMA, Bollinger Bands, ATR, Support/Resistance, and Trend analysis).
3. **News Agent**: Gathers recent headlines, news feeds, and articles for market sentiment.
4. **Risk Agent**: Computes volatility metrics and risk ratios.

---

## 🛠️ Technology Stack

* **Backend**: Python, Django, Django REST Framework, SimpleJWT, LangGraph / LangChain, SQLite.
* **Frontend**: React, Vite, ES6 Javascript, Vanilla CSS / Tailwind.

---

## 🚀 Getting Started

### 1. Backend Setup

1. **Navigate to the backend folder**:
   ```bash
   cd backend
   ```

2. **Set up a virtual environment** (if not already created):
   ```bash
   python -m venv venv
   source venv/Scripts/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Variables**:
   Create a `.env` file inside the `backend` directory (do not commit this to Git). Add your API credentials and configurations:
   ```env
   SECRET_KEY=your-django-secret-key
   OPENAI_API_KEY=your-llm-api-key
   ```

5. **Run Migrations & Seed Data**:
   ```bash
   python manage.py migrate
   python manage.py shell  # Use seed scripts to load initial data if available
   ```

6. **Start the Django Development Server**:
   ```bash
   python manage.py runserver
   ```

---

### 2. Frontend Setup

1. **Navigate to the frontend folder**:
   ```bash
   cd ../frontend
   ```

2. **Install node packages**:
   ```bash
   npm install
   ```

3. **Start the Vite development server**:
   ```bash
   npm run dev
   ```

---

## 🔒 Security & Git Configuration

To prevent exposing API keys, databases, or local workspace configurations to GitHub, `.gitignore` rules have been set up at the root, frontend, and backend directories to automatically ignore:
* All virtual environment directories (`venv/`, `.venv/`, `env/`)
* Environment secrets files (`.env`, `*.env`, `secrets.json`)
* Local databases and SQLite journals (`db.sqlite3`, `db.sqlite3-journal`)
* Python compilation folders (`__pycache__/`, `*.pyc`)
* Frontend dependency caches and build directories (`node_modules/`, `dist/`)
* IDE settings folders (`.vscode/`, `.idea/`)

