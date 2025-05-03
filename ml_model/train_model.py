# ml_model/train_model.py
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib
import mysql.connector
import numpy as np
import matplotlib.pyplot as plt

# Export data to CSV
def export_data_to_csv():
    conn = mysql.connector.connect(
        host="127.0.0.1",
        user="root",
        password="De01214!",
        database="userDB"
    )

    query = """
    SELECT 
        timestamp, total_bookings, time_to_departure_minutes,
        day_of_week, hour_of_day, origin, destination,
        airline_code, seats_remaining, base_price, current_price
    FROM pricing_snapshots
    """

    df = pd.read_sql(query, conn)
    df.to_csv("pricing_snapshots.csv", index=False)
    conn.close()
    print("Exported training data to pricing_snapshots.csv")

export_data_to_csv()

# Load data
df = pd.read_csv("pricing_snapshots.csv")

# Feature engineering
df['origin_dest'] = df['origin'] + "_" + df['destination']
df['airline_route'] = df['airline_code'] + "_" + df['origin_dest']
df = pd.get_dummies(df, columns=['airline_route'], drop_first=True)

# Define features and target
features = [
    'total_bookings',
    'time_to_departure_minutes',
    'day_of_week',
    'hour_of_day',
    'seats_remaining'
] + [col for col in df.columns if col.startswith('airline_route_')]

X = df[features]
y = df['current_price']

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Save model
joblib.dump(model, 'flight_price_model.pkl')

# Evaluate model
y_pred = model.predict(X_test)

mae = mean_absolute_error(y_test, y_pred)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
r2 = r2_score(y_test, y_pred)

print("\nModel Evaluation Metrics:")
print(f"MAE (Mean Absolute Error): {mae:.2f}")
print(f"RMSE (Root Mean Squared Error): {rmse:.2f}")
print(f"R² Score: {r2:.2f}")

# Optional plot
plt.scatter(y_test, y_pred, alpha=0.5)
plt.xlabel("Actual Price")
plt.ylabel("Predicted Price")
plt.title("Actual vs Predicted Flight Prices")
plt.grid(True)
plt.show()
