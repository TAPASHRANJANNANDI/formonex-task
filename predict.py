import pickle
import pandas as pd

# Load model & scaler
with open("model/model.pkl", "rb") as f:
    model = pickle.load(f)

with open("model/scaler.pkl", "rb") as f:
    scaler = pickle.load(f)

# Get feature names from scaler (IMPORTANT)
feature_names = scaler.feature_names_in_

# Raw user input (human readable)
user_input = {
    "is_returning_user": 1,
    "age": 30,
    "visits": 5,
    "avg_time_spent_minutes": 12.5,
    "pages_viewed": 15,
    "previous_purchases": 2,
    "cart_added": 1,
    "discount_applied": 1,
    "gender": "Male",
    "country": "India",
    "device_type": "Mobile"
}

# Convert to DataFrame
df = pd.DataFrame([user_input])

# One-hot encode
df = pd.get_dummies(df)

# Add missing columns expected by scaler
for col in feature_names:
    if col not in df.columns:
        df[col] = 0

# Remove extra columns not seen during training
df = df[feature_names]

# Scale and predict
df_scaled = scaler.transform(df)
prediction = model.predict(df_scaled)

print("Will Purchase:", "YES" if prediction[0] == 1 else "NO")
