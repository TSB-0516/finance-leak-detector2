from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.upload import router as upload_router
from app.database.db import init_db, seed_data
from app.routes.dashboard import router as dashboard_router

init_db()
seed_data()
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(upload_router)
app.include_router(dashboard_router, prefix="/dashboard")

@app.get("/")
def root():
    return {"message": "Finance Leak Detector Running"}
