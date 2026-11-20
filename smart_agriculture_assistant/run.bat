@echo off
title AI-Based Smart Agriculture Assistant
echo ========================================================
echo Starting AI-Based Smart Agriculture Assistant Platform
echo ========================================================
echo.
echo Ensuring database and models are initialized...
python database\init_db.py
echo.
echo Launching Flask Web Server on http://127.0.0.1:5000...
echo Open your web browser and navigate to http://127.0.0.1:5000
echo Press Ctrl+C in this window to stop the server.
echo.
python app.py
pause
