from fastapi import FastAPI
from app.routes.upload import router as upload_router
from app.database.db import init_db, seed_data

init_db()
seed_data()
app = FastAPI()

app.include_router(upload_router)

@app.get("/")
def root():
    return {"message": "Finance Leak Detector Running"}