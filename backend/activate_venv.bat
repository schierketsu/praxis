@echo off
echo Activating virtual environment...
call venv\Scripts\activate.bat
echo Virtual environment activated!
echo.
echo To install dependencies, run:
echo pip install -r requirements.txt
echo.
echo To run the server, run:
echo python manage.py runserver
echo.
cmd /k
