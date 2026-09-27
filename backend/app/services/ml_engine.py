import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
import xgboost as xgb
import shap

class FreightForecaster:
    def __init__(self):
        self.xgb_model = xgb.XGBRegressor(n_estimators=100, random_state=42)
        self.rf_model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.is_trained = False
        self.explainer = None
        
    def train(self):
        # Create dummy training data to make the MVP run immediately
        np.random.seed(42)
        n = 500
        
        # Features: bunker_price, congestion, demand
        X = pd.DataFrame({
            'bunker_price': np.random.normal(500, 50, n),
            'congestion': np.random.uniform(0, 100, n),
            'demand': np.random.normal(100, 20, n)
        })
        
        # Target: freight rate
        # Rule: high bunker + high congestion + high demand = high rate
        y = 10 + (X['bunker_price'] * 0.02) + (X['congestion'] * 0.05) + (X['demand'] * 0.03) + np.random.normal(0, 1, n)
        
        self.xgb_model.fit(X, y)
        self.rf_model.fit(X, y)
        
        # Setup SHAP explainer
        self.explainer = shap.TreeExplainer(self.xgb_model)
        self.is_trained = True
        
    def predict(self, origin, dest, date_str, bunker_shock=0, congestion_shock=0):
        if not self.is_trained:
            self.train()
            
        # Base features for prediction
        features = pd.DataFrame({
            'bunker_price': [550 + (550 * (bunker_shock/100))],
            'congestion': [65 + congestion_shock],
            'demand': [110]
        })
        
        pred_rate = float(self.xgb_model.predict(features)[0])
        
        # Get SHAP values for explainability
        shap_values = self.explainer.shap_values(features)
        
        # Format explanation
        explanation = {
            'fuel_impact': float(shap_values[0][0]),
            'congestion_impact': float(shap_values[0][1]),
            'demand_impact': float(shap_values[0][2]),
            'base_value': float(self.explainer.expected_value)
        }
        
        # Create a 90-day trajectory based on the base prediction
        trajectory = []
        days = [1, 7, 14, 30, 60, 90]
        
        current_rate = pred_rate
        for day in days:
            # Simulate a trend (e.g., slight increase over time)
            noise = np.random.normal(0, 0.5)
            drift = day * 0.05
            future_rate = current_rate + drift + noise
            
            trajectory.append({
                'day': f'Day {day}',
                'xgb': round(future_rate, 2),
                'lstm': round(future_rate * 0.98, 2), # Mock LSTM prediction slightly lower
                'lower': round(future_rate * 0.85, 2),
                'upper': round(future_rate * 1.15, 2),
                'actual': round(current_rate, 2) if day == 1 else None
            })
            
        return {
            'current_predicted_rate': round(pred_rate, 2),
            'trajectory': trajectory,
            'explanation': explanation
        }
