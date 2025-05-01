import os
# Remove tensorflow warnings
import warnings
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
warnings.filterwarnings("ignore", category=UserWarning, module='keras.src.layers.core.dense')
# --
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from tensorflow.keras.models import Sequential # type: ignore
from tensorflow.keras.layers import Dense # type: ignore
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS

# Path to the folder where the CSV files are located
data_folder = r'data_storage'

# Read and combine all CSV files
def load_data(folder):
    all_data = pd.DataFrame()
    for file in os.listdir(folder):
        if file.endswith('.csv') and file.startswith('f1_'):
            file_path = os.path.join(folder, file)
            temp_data = pd.read_csv(file_path)
            all_data = pd.concat([all_data, temp_data], ignore_index=True)
    return all_data

# Preprocess the data
def preprocess_data(data):
    # Encode categorical columns
    label_encoder_driver = LabelEncoder()
    data['driver'] = label_encoder_driver.fit_transform(data['driver'])

    label_encoder_constructor = LabelEncoder()
    data['constructor'] = label_encoder_constructor.fit_transform(data['constructor'])

    label_encoder_status = LabelEncoder()
    data['status'] = label_encoder_status.fit_transform(data['status'])

    # Select relevant features
    features = ['season', 'round', 'driver', 'constructor', 'grid', 'laps', 'status']
    X = data[features]
    y = data['points']  # Label to predict

    # Normalize numerical features
    scaler = StandardScaler()
    X = scaler.fit_transform(X)

    return X, y, label_encoder_driver

# Create the model
def create_model(input_shape):
    model = Sequential([
        Dense(128, activation='relu', input_shape=(input_shape,)),
        Dense(64, activation='relu'),
        Dense(1, activation='linear')  # Output for regression
    ])
    model.compile(optimizer='adam', loss='mse', metrics=['mae'])
    return model

# Train and evaluate the model
def train_and_evaluate_model(X_train, X_test, y_train, y_test):
    model = create_model(X_train.shape[1])
    model.fit(X_train, y_train, epochs=50, batch_size=32, validation_split=0.2)
    loss, mae = model.evaluate(X_test, y_test)
    print(f"Mean Absolute Error: {mae}")
    return model

# Make predictions for a specific race
def predict_for_race(model, data, label_encoder_driver):
    print("Test.")

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/seasons', methods=['GET'])
def get_seasons():
    seasons = data['season'].unique().tolist()
    return jsonify({'seasons': seasons})

@app.route('/api/rounds', methods=['GET'])
def get_rounds():
    season = int(request.args.get('season'))
    rounds = data[data['season'] == season]['round'].unique().tolist()
    return jsonify({'rounds': rounds})

@app.route('/api/predict', methods=['GET'])
def predict():
    season = int(request.args.get('season'))
    round_ = int(request.args.get('round'))
    race_data = data[(data['season'] == season) & (data['round'] == round_)]
    if race_data.empty:
        return jsonify({'predictions': []})

    # Preprocess race data for prediction
    features = ['season', 'round', 'driver', 'constructor', 'grid', 'laps', 'status']
    X_race = race_data[features]
    scaler = StandardScaler()
    X_race = scaler.fit_transform(X_race)

    # Make predictions
    predictions = model.predict(X_race)
    probabilities = np.exp(predictions) / np.sum(np.exp(predictions))
    race_data['Winning Probability'] = probabilities
    race_data['driver_name'] = label_encoder_driver.inverse_transform(race_data['driver'])

    # Prepare results
    results = race_data.sort_values(by='Winning Probability', ascending=False).to_dict(orient='records')
    return jsonify({'predictions': [{'driver': r['driver_name'], 'probability': round(r['Winning Probability'] * 100, 2)} for r in results]})

# Main
if __name__ == "__main__":
    # Load data
    data = load_data(data_folder)
    print(f"Data loaded: {len(data)} rows")

    # Preprocess data
    X, y, label_encoder_driver = preprocess_data(data)

    # Split into training and testing
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Train and evaluate the model
    model = train_and_evaluate_model(X_train, X_test, y_train, y_test)

    # Start the Flask server
    print("Server running at http://127.0.0.1:5000")
    app.run(debug=True, use_reloader=False)