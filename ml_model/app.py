# ml_model/app.py
from flask import Flask, request, jsonify
import joblib
import pandas as pd

app = Flask(__name__)

# Load model
model = joblib.load('flight_price_model.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    df = pd.DataFrame([data])

    # Feature engineering
    df['origin_dest'] = df['origin'] + "_" + df['destination']
    df['airline_route'] = df['airline_code'] + "_" + df['origin_dest']
    df = pd.get_dummies(df)

    # Align features
    model_features = model.feature_names_in_
    for feature in model_features:
        if feature not in df.columns:
            df[feature] = 0
    df = df[model_features]

    # Predict
    prediction = model.predict(df)[0]
    return jsonify({'predicted_price': round(prediction, 2)})

if __name__ == '__main__':
    app.run(debug=True)
