from database import SessionLocal, engine
import models

try:
    print("Dropping all tables...")
    models.Base.metadata.drop_all(bind=engine)
    print("Creating all tables...")
    models.Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    print("Querying connections...")
    c = db.query(models.Connection).first()
    print("Done.")
except Exception as e:
    import traceback
    traceback.print_exc()
finally:
    db.close()
