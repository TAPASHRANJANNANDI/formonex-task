from fastapi import FastAPI
from pydantic import BaseModel
import pickle
import pandas as pd
from pymongo import MongoClient
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware

# ---------------------------
# FastAPI app (CREATE FIRST)
# ---------------------------
app = FastAPI(title="Sales Prediction API")

# ---------------------------
# CORS
# ---------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------
# Load ML model & scaler
# ---------------------------
with open("model/model.pkl", "rb") as f:
    model = pickle.load(f)

with open("model/scaler.pkl", "rb") as f:
    scaler = pickle.load(f)

FEATURES = scaler.feature_names_in_

# ---------------------------
# MongoDB connection
# ---------------------------
client = MongoClient(
    "mongodb+srv://tapashbariflo_db_user:yuYD21YBP1bziUSx@cluster1.ynrsg2p.mongodb.net/"
)
db = client["sales_ml"]
collection = db["training_data"]

# ---------------------------
# Input Schema
# ---------------------------
class SalesInput(BaseModel):
    is_returning_user: int
    age: int
    visits: int
    avg_time_spent_minutes: float
    pages_viewed: int
    previous_purchases: int
    cart_added: int
    discount_applied: int
    gender: str
    country: str
    device_type: str

# ---------------------------
# Prediction Endpoint
# ---------------------------
@app.post("/predict")
def predict(data: SalesInput):

    # Convert input to DataFrame
    df = pd.DataFrame([data.dict()])

    # One-hot encode categorical features
    df = pd.get_dummies(df)

    # Add missing columns
    for col in FEATURES:
        if col not in df.columns:
            df[col] = 0

    # Maintain column order
    df = df[FEATURES]

    # Scale
    df_scaled = scaler.transform(df)

    # Predict
    will_purchase = int(model.predict(df_scaled)[0])

    # Store input + result
    record = {
        **data.dict(),
        "will_purchase": will_purchase,
        "created_at": datetime.utcnow()
    }

    collection.insert_one(record)

    return {
        "will_purchase": will_purchase
    }
