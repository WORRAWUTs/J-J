# Stock Management System

A FastAPI-based stock management system for tracking inventory, user management, and warranty information.

## Features

- User Authentication (Register/Login)
- Inventory Management
- Ticket System
- Warranty Tracking
- Notification System

## Tech Stack

- Python 3.8+
- FastAPI
- SQLAlchemy
- MySQL
- PyMySQL
- Pydantic
- JWT Authentication

## Project Structure

```
stock-app/
├── backend/
│   ├── routes/
│   │   ├── auth.py
│   │   ├── inventory.py
│   │   └── ...
│   ├── models.py
│   ├── schemas.py
│   ├── database.py
│   └── auth.py
└── tests/
    └── test_register_login_inventory.py
```

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd stock-app
```

2. Create a virtual environment and activate it:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up the database:
- Create a MySQL database
- Update the database connection string in `backend/database.py`

5. Run the server:
```bash
uvicorn backend.main:app --reload
```

## API Documentation

Once the server is running, you can access:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Testing

Run the test script:
```bash
python test_register_login_inventory.py
```

## License

MIT 