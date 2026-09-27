from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from app.services.ml_engine import FreightForecaster
from app.services.advanced_features import calculate_sustainability, get_predictive_eta

app = FastAPI(title="Maritime AI Platform API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

forecaster = FreightForecaster()

class ForecastRequest(BaseModel):
    origin: str = "Australia"
    destination: str = "Paradip"
    date: str = "2026-09-13"
    bunker_shock: float = 0.0
    congestion_shock: float = 0.0

@app.post("/api/forecast")
def get_forecast(request: ForecastRequest):
    return forecaster.predict(
        origin=request.origin,
        dest=request.destination,
        date_str=request.date,
        bunker_shock=request.bunker_shock,
        congestion_shock=request.congestion_shock
    )

class AdvancedRequest(BaseModel):
    origin: str = "Australia"
    destination: str = "Paradip"
    vessel_type: str = "Capesize"
    date: str = "2026-09-13"
    congestion: float = 65.0

@app.post("/api/sustainability")
def get_sustainability(request: AdvancedRequest):
    return calculate_sustainability(request.origin, request.destination, request.vessel_type)

@app.post("/api/eta")
def get_eta(request: AdvancedRequest):
    return get_predictive_eta(request.origin, request.destination, request.date, request.congestion)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
