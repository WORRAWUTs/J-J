from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.exc import SQLAlchemyError
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DATABASE_URL = "mysql+pymysql://manpad:Google2012@205.209.119.254/project_pro?charset=utf8mb4"

try:
    # Configure connection pooling and timeout
    engine = create_engine(
        DATABASE_URL,
        pool_size=5,
        max_overflow=10,
        pool_timeout=30,
        pool_recycle=1800,  # Recycle connections after 30 minutes
        pool_pre_ping=True,  # Enable connection health checks
        connect_args={
            'charset': 'utf8mb4',
            'connect_timeout': 60
        }
    )
    
    logger.info("Database engine created successfully")
except Exception as e:
    logger.error(f"Error creating database engine: {str(e)}")
    raise

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

@event.listens_for(engine, "connect")
def connect(dbapi_connection, connection_record):
    logger.info("New database connection established")

@event.listens_for(engine, "checkout")
def checkout(dbapi_connection, connection_record, connection_proxy):
    logger.info("Database connection checked out from pool")

def get_db():
    db = SessionLocal()
    try:
        # Test the connection
        db.execute("SELECT 1")
        logger.info("Database connection test successful")
        yield db
    except SQLAlchemyError as e:
        logger.error(f"Database error: {str(e)}")
        raise
    finally:
        logger.info("Closing database connection")
        db.close()
