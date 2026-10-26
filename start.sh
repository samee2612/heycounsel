#!/usr/bin/env bash
# HeyCounsel Demo Startup Script
# Starts FastAPI backend (port 8000) and Next.js frontend (port 3000)

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "=========================================================="
echo " Starting HeyCounsel Independent Legal Platform"
echo " Backend: FastAPI + SQLAlchemy + Local Semantic Search (8000)"
echo " Frontend: Next.js + TypeScript + Tailwind (3000)"
echo " MCP: Model Context Protocol Server ready in ./backend"
echo "=========================================================="

# Start backend
cd "$ROOT_DIR/backend"
PYTHONPATH=. ./venv/bin/uvicorn app.main:app --port 8000 &
BACKEND_PID=$!
echo "Backend running with PID $BACKEND_PID"

# Start frontend
cd "$ROOT_DIR/frontend"
npm run dev -- -p 3000 &
FRONTEND_PID=$!
echo "Frontend running with PID $FRONTEND_PID"

cleanup() {
    echo ""
    echo "Shutting down HeyCounsel services..."
    kill "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null || true
    wait "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null || true
    echo "All services stopped."
}

trap cleanup SIGINT SIGTERM EXIT

echo ""
echo "HeyCounsel is live!"
echo "Open: http://localhost:3000"
echo "API Docs: http://localhost:8000/docs"
echo "Press Ctrl+C to terminate."
echo ""

wait
