@echo off
start cmd /k "cd backend && npm run dev"
start cmd /k "cd frontend && npm run dev"
echo Port Checker Web is starting...
echo Backend: http://localhost:3001
echo Frontend: http://localhost:5173
