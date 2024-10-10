# backend/database.py

from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from models import Base
import os, time
from sqlalchemy.exc import OperationalError
from models import Document

# Environment variables
POSTGRES_USER = os.getenv("POSTGRES_USER", "postgres")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD", "Zania1%4023")
POSTGRES_HOST = os.getenv("POSTGRES_HOST", "localhost")
POSTGRES_PORT = os.getenv("POSTGRES_PORT", "5432")
POSTGRES_DB = os.getenv("POSTGRES_DB", "postgres")

# Asynchronous Database URL
ASYNC_DATABASE_URL = f"postgresql+asyncpg://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}"

# Synchronous Database URL for initialization
SYNC_DATABASE_URL = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}"

# Create asynchronous engine
async_engine = create_async_engine(ASYNC_DATABASE_URL, echo=True)

# Create asynchronous sessionmaker
AsyncSessionLocal = sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False
)

# Create synchronous engine for initialization
sync_engine = create_engine(SYNC_DATABASE_URL, echo=True)

# Synchronous sessionmaker (if needed)
SyncSessionLocal = sessionmaker(
    bind=sync_engine,
    autoflush=False,
    autocommit=False
)

def insert_initial_data():
    """
    Insert initial data into the database.
    """
    # Create a new session
    session = SyncSessionLocal()
    try:
        # Define initial data
        initial_documents = [
            Document(type="bank-draft", title="Bank Draft", position=0),
            Document(type="bill-of-lading", title="Bill of Lading", position=1),
            Document(type="invoice", title="Invoice", position=2),
            Document(type="bank-draft-2", title="Bank Draft 2", position=3),
            Document(type="bill-of-lading-2", title="Bill of Lading 2", position=4),
        ]

        # Add initial data to the session
        session.add_all(initial_documents)

        # Commit the session to save the data
        session.commit()
        print("Initial data inserted successfully.")
    except Exception as e:
        print(f"Failed to insert initial data: {e}")
        session.rollback()  # Rollback in case of error
    finally:
        session.close()  # Ensure the session is closed

def init_db(retries=3, delay=60):
    """
    Initialize the database by creating all tables.
    This uses the synchronous engine.
    
    Args:
        retries (int): Number of connection attempts before giving up.
        delay (int): Delay in seconds between each attempt.
    """
    for attempt in range(retries):
        try:
            Base.metadata.create_all(bind=sync_engine)
            print("Database initialized successfully.")


            # Insert initial data
            insert_initial_data()
            
            return
        
        except OperationalError as e:
            print(f"Attempt {attempt + 1} failed: {e}. Retrying in {delay} seconds...")
            time.sleep(delay)  # Wait before retrying
    raise Exception("Failed to connect to the database after several attempts.")        