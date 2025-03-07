from backend.database import engine
from backend.models import Base
from sqlalchemy import text

def recreate_tables():
    print("Disabling foreign key checks...")
    with engine.connect() as conn:
        conn.execute(text("SET FOREIGN_KEY_CHECKS=0;"))
        print("Dropping all tables...")
        Base.metadata.drop_all(bind=engine)
        print("Creating all tables...")
        Base.metadata.create_all(bind=engine)
        conn.execute(text("SET FOREIGN_KEY_CHECKS=1;"))
        conn.commit()
    print("Done!")

if __name__ == "__main__":
    recreate_tables() 