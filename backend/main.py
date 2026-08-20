import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import init_db
from routers import scan, batches, markets, prices, copilot, logistics, listings, matching, offers

app = FastAPI(title="AI Produce Intelligence Platform")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()
    os.makedirs(os.path.join(os.path.dirname(os.path.abspath(__file__)), "data", "uploads"), exist_ok=True)

app.include_router(scan.router)
app.include_router(batches.router)
app.include_router(markets.router)
app.include_router(prices.router)
app.include_router(copilot.router)
app.include_router(logistics.router)
app.include_router(listings.router)
app.include_router(matching.router)
app.include_router(offers.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to AI Produce Intelligence Platform API"}
