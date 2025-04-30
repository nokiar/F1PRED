import os
# Remove tensorflow warnings
import warnings
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
warnings.filterwarnings("ignore", category=UserWarning, module='keras.src.layers.core.dense')
# --
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS  # Importar CORS

# Ruta de la carpeta donde están los archivos CSV
data_folder = r'data_storage'

# Leer y combinar todos los archivos CSV
def load_data(folder):
    all_data = pd.DataFrame()
    for file in os.listdir(folder):
        if file.endswith('.csv') and file.startswith('f1_'):
            file_path = os.path.join(folder, file)
            temp_data = pd.read_csv(file_path)
            all_data = pd.concat([all_data, temp_data], ignore_index=True)
    return all_data

# Preprocesar los datos
def preprocess_data(data):
    # Codificar columnas categóricas
    label_encoder_driver = LabelEncoder()
    data['driver'] = label_encoder_driver.fit_transform(data['driver'])

    label_encoder_constructor = LabelEncoder()
    data['constructor'] = label_encoder_constructor.fit_transform(data['constructor'])

    label_encoder_status = LabelEncoder()
    data['status'] = label_encoder_status.fit_transform(data['status'])

    # Seleccionar características relevantes
    features = ['season', 'round', 'driver', 'constructor', 'grid', 'laps', 'status']
    X = data[features]
    y = data['points']  # Etiqueta a predecir

    # Normalizar características numéricas
    scaler = StandardScaler()
    X = scaler.fit_transform(X)

    return X, y, label_encoder_driver

# Crear el modelo
def create_model(input_shape):
    model = Sequential([
        Dense(128, activation='relu', input_shape=(input_shape,)),
        Dense(64, activation='relu'),
        Dense(1, activation='linear')  # Salida para regresión
    ])
    model.compile(optimizer='adam', loss='mse', metrics=['mae'])
    return model

# Entrenar y evaluar el modelo
def train_and_evaluate_model(X_train, X_test, y_train, y_test):
    model = create_model(X_train.shape[1])
    model.fit(X_train, y_train, epochs=50, batch_size=32, validation_split=0.2)
    loss, mae = model.evaluate(X_test, y_test)
    print(f"Mean Absolute Error: {mae}")
    return model

# Hacer predicciones para una carrera específica
def predict_for_race(model, data, label_encoder_driver):
    print("This function is no longer used for console input predictions.")
    # Puedes eliminar este código si ya no es necesario.

app = Flask(__name__)
CORS(app)  # Habilitar CORS para todas las rutas

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
    race_data['Probabilidad de ganar'] = probabilities
    race_data['driver_name'] = label_encoder_driver.inverse_transform(race_data['driver'])

    # Prepare results
    results = race_data.sort_values(by='Probabilidad de ganar', ascending=False).to_dict(orient='records')
    return jsonify({'predictions': [{'driver': r['driver_name'], 'probability': round(r['Probabilidad de ganar'] * 100, 2)} for r in results]})

# Main
if __name__ == "__main__":
    # Cargar datos
    data = load_data(data_folder)
    print(f"Datos cargados: {len(data)} filas")

    # Preprocesar datos
    X, y, label_encoder_driver = preprocess_data(data)

    # Dividir en entrenamiento y prueba
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Entrenar y evaluar el modelo
    model = train_and_evaluate_model(X_train, X_test, y_train, y_test)

    # Iniciar el servidor Flask
    print("Server running at http://127.0.0.1:5000")
    app.run(debug=True, use_reloader=False)