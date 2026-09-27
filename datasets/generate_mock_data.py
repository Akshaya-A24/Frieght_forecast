import pandas as pd
import numpy as np
import os
from datetime import datetime, timedelta

def generate_datasets():
    print("Generating demo datasets...")
    os.makedirs('datasets', exist_ok=True)
    
    # 1. Freight Dataset
    dates = pd.date_range(start="2024-01-01", end="2026-09-01", freq="D")
    origins = ['Australia', 'Indonesia', 'South Africa']
    destinations = ['Kolkata', 'Haldia', 'Paradip', 'Visakhapatnam', 'Chennai']
    commodities = ['Coal', 'Iron Ore', 'Fertilizer']
    
    freight_data = []
    for d in dates:
        origin = np.random.choice(origins)
        dest = np.random.choice(destinations)
        freight_data.append({
            'date': d.strftime('%Y-%m-%d'),
            'origin': origin,
            'destination': dest,
            'commodity': np.random.choice(commodities),
            'freight_rate': round(np.random.normal(20 if origin == 'Indonesia' else 25, 2), 2),
            'vessel_type': np.random.choice(['Supramax', 'Panamax', 'Capesize']),
            'cargo_quantity': np.random.randint(50000, 150000)
        })
    pd.DataFrame(freight_data).to_csv('datasets/freight_rates.csv', index=False)
    
    # 2. Port Dataset
    port_data = []
    for p in destinations:
        port_data.append({
            'port': p,
            'congestion_index': round(np.random.uniform(0.1, 0.9), 2),
            'waiting_time_days': round(np.random.uniform(1, 7), 1),
            'berth_availability': np.random.randint(1, 5)
        })
    pd.DataFrame(port_data).to_csv('datasets/ports.csv', index=False)
    
    print("Datasets generated successfully in /datasets!")

if __name__ == "__main__":
    generate_datasets()
