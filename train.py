import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report
import pickle
import os

# ---------------------------------
# Load CSV (your exact requirements)
# ---------------------------------
df = pd.read_csv(
    "data/sales-data.csv",
    sep=",",
    header=None
)

# ---------------------------------
# Step 1: Restore header FIRST
# ---------------------------------
header = df.iloc[0].astype(str)
df = df.iloc[1:].reset_index(drop=True)
df.columns = header

# ---------------------------------
# Step 2: Clean column names SAFELY
# ---------------------------------
df.columns = (
    df.columns
    .astype(str)        # critical line
    .str.strip()
     .str.lower()
     .str.replace(" ", "_")
    )

# ---------------------------------
# Step 3: Remove duplicates
# ---------------------------------
df.drop_duplicates(inplace=True)

# ---------------------------------
# Step 4: Convert boolean columns
# ---------------------------------
bool_map = {"true": 1, "false": 0}

df["cart_added"] = df["cart_added"].astype(str).str.lower().map(bool_map)
df["discount_applied"] = df["discount_applied"].astype(str).str.lower().map(bool_map)

print("Data Loaded & Cleaned Successfully")

# ---------------------------------
# Step 5: One-hot encoding
# ---------------------------------
df = pd.get_dummies(
    df,
    columns=["gender", "country", "device_type"],
    drop_first=True
)

# ---------------------------------
# Step 6: Features & target
# ---------------------------------
X = df.drop(columns=["user_id", "will_purchase"])
y = df["will_purchase"]

# ---------------------------------
# Step 7: Train-test split
# ---------------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# ---------------------------------
# Step 8: Scaling
# ---------------------------------
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# ---------------------------------
# Step 9: Train model
# ---------------------------------
model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)

# ---------------------------------
# Step 10: Evaluate
# ---------------------------------
y_pred = model.predict(X_test)

print("Accuracy:", accuracy_score(y_test, y_pred))
print(classification_report(y_test, y_pred))

# ---------------------------------
# Step 11: Save artifacts
# ---------------------------------
os.makedirs("model", exist_ok=True)

with open("model/model.pkl", "wb") as f:
    pickle.dump(model, f)

with open("model/scaler.pkl", "wb") as f:
    pickle.dump(scaler, f)

print("Model & Scaler Saved Successfully")
