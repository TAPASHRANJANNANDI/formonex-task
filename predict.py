import pickle
import numpy as np

# Load model & scaler
with open("model/model.pkl", "rb") as f:
    model = pickle.load(f)

with open("model/scaler.pkl", "rb") as f:
    scaler = pickle.load(f)

# Example input (same order as training)
sample_user = np.array([[ 
    30,   # age
    5,    # visits
    12.5, # avg_time_spent_minutes
    15,   # pages_viewed
    2,    # previous_purchases
    1,    # cart_added
    1,    # discount_applied
    1, 0, 0,  # gender_male, country_germany, country_india
    1, 0     # device_mobile, device_tablet
]])

sample_user = scaler.transform(sample_user)
prediction = model.predict(sample_user)

print("Will Purchase:", "YES" if prediction[0] == 1 else "NO")
