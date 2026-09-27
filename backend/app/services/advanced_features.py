import random
from datetime import datetime, timedelta

def calculate_sustainability(origin, dest, vessel_type):
    # Mock calculation for CO2 emissions
    distance_map = {
        "Australia": 4500,
        "Indonesia": 2200,
        "South Africa": 3800
    }
    base_dist = distance_map.get(origin, 3000)
    
    # Capesize (150k) is more efficient per ton, but burns more overall
    efficiency = {
        "Capesize": 0.015, # tons CO2 per nautical mile
        "Panamax": 0.012,
        "Supramax": 0.010
    }
    
    co2_tons = base_dist * efficiency.get(vessel_type, 0.012)
    
    # Green Route alternative
    green_co2 = co2_tons * 0.85 # Slow steaming alternative
    
    return {
        "standard_co2_tons": round(co2_tons, 2),
        "green_route_co2_tons": round(green_co2, 2),
        "fuel_saved_tons": round((co2_tons - green_co2) / 3.1, 2)
    }

def get_predictive_eta(origin, dest, date_str, congestion_index):
    try:
        start_date = datetime.strptime(date_str, "%Y-%m-%d")
    except:
        start_date = datetime.now()
        
    distance_map = {
        "Australia": 4500,
        "Indonesia": 2200,
        "South Africa": 3800
    }
    dist = distance_map.get(origin, 3000)
    
    # Base transit time at 12 knots (approx 288 nm/day)
    base_days = dist / 288
    
    # Delay from congestion (0 to 100) -> adds 0 to 7 days
    delay_days = (congestion_index / 100) * 7
    
    # Weather risk delay
    weather_delay = random.uniform(0, 2)
    
    total_days = base_days + delay_days + weather_delay
    eta_date = start_date + timedelta(days=total_days)
    
    return {
        "estimated_arrival": eta_date.strftime("%Y-%m-%d"),
        "base_transit_days": round(base_days, 1),
        "predicted_delay_days": round(delay_days + weather_delay, 1),
        "confidence": random.randint(75, 95)
    }
