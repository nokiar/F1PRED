````markdown
# F1PRED: AI-Powered Formula 1 Analysis and Prediction

## Project Overview

F1PRED is a web application developed as a final year BSc (Hons) Computing project for the University of Worcester[cite: 83]. It investigates the effectiveness of Artificial Intelligence (AI) models in predicting Formula 1 race outcomes[cite: 84]. The application allows users to explore historical F1 data (races, drivers, constructors, standings) and view AI-generated predictions for race win probabilities[cite: 86, 209].

The project utilises historical data fetched from the Ergast API [cite: 86] and employs a Neural Network model built with TensorFlow/Keras to generate predictions[cite: 87, 210]. Key findings during development indicated moderate predictive accuracy[cite: 89], highlighting the dominant influence of constructor performance [cite: 88] and the challenges posed by data limitations [cite: 90] and the sport's unpredictability[cite: 90].

## Features

* **Historical Data Browser:** View detailed results for Races, Drivers, Constructors, and Standings across different F1 seasons (1950-present).
* **AI Predictions:** Select a season and round to view AI-generated win probability predictions for drivers in that race.
* **Comparative View:** Display actual race results alongside AI predictions for direct comparison and evaluation (within the Predictions section).

## Technologies Used

* **Frontend:** HTML, CSS, JavaScript (with jQuery)
* **Backend (API & AI):** Python
    * **Web Framework:** Flask
    * **API Communication:** Flask-Cors
    * **Machine Learning:** TensorFlow / Keras
    * **Data Handling:** Pandas, NumPy
    * **Preprocessing:** Scikit-learn
* **Data Source:** Ergast Developer API (for historical data)
* **Deployment Consideration:** Gunicorn (WSGI Server) [included in requirements.txt]

## Project Structure

```
F1PRED/
│
├── predictions/
│   └── pred.py           # Backend Flask API and ML model script
│
├── scripts/
│   └── main.js           # Frontend JavaScript logic
│
├── styles/
│   └── styles.css        # Frontend CSS styles
│
├── data_storage/         # (Created by data_generation.py) Stores downloaded CSVs
│   └── f1_YYYY.csv       # CSV file per season
│
├── assets/               # Folder for images, logos etc.
│
├── data_generation.py    # Script to download data from Ergast API
├── index.html            # Main frontend HTML file
├── requirements.txt      # Python dependencies for backend
└── README.md             # This file
```

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd F1PRED
    ```

2.  **Create a Virtual Environment (Recommended):**
    ```bash
    python -m venv venv
    ```
    Activate it:
    * Windows: `.\venv\Scripts\activate`
    * macOS/Linux: `source venv/bin/activate`

3.  **Install Dependencies:** Ensure you have Python 3 installed. Install the required libraries for the backend:
    ```bash
    pip install -r requirements.txt
    ```

4.  **Generate Historical Data:** Before running the backend for the first time, you need to download the historical race data. Run the data generation script:
    ```bash
    python data_generation.py
    ```
    This will contact the Ergast API and create CSV files for each season in the `data_storage` directory. This might take some time depending on the number of years and API responsiveness.

## Running the Application

The application consists of two parts that need to be run separately: the backend API and the frontend interface.

### 1. Running the Backend (Prediction API)

* Navigate to the project's root directory (`F1PRED`) in your terminal (and ensure your virtual environment is activated if you created one).
* Run the Flask application script:
    ```bash
    python predictions/pred.py
    ```
* This will:
    * Load the data from `data_storage`.
    * Train the AI model (this happens once on startup). You will see epoch output in the console.
    * Start the Flask development server, typically available at `http://127.0.0.1:5000`.
* Keep this terminal window open while using the application, as it runs the server.

### 2. Running the Frontend

* The frontend (`index.html`) needs to be served by a local web server to handle potential CORS issues when making API calls to the backend. Simply opening the `index.html` file directly in the browser (`file://...`) might prevent the JavaScript from fetching data from `http://127.0.0.1:5000`.
* **Option A: Using VS Code Live Server:** If you use Visual Studio Code, install the "Live Server" extension, right-click on `index.html` in the file explorer, and select "Open with Live Server".
* **Option B: Using Python's HTTP Server:**
    * Open a *new* terminal window.
    * Navigate to the project's root directory (`F1PRED`).
    * Run the command: `python -m http.server` (for Python 3).
    * This will start a simple server, usually at `http://localhost:8000`. Open this address in your web browser.
* Once the frontend is open in your browser via a local server, you can navigate through the sections. The "Predictions" section will make calls to the backend running at `http://127.0.0.1:5000`.

## Author

* **Carlos Germa** [cite: 83]

## Supervisor

* **Akinola Siyanbola** [cite: 83]

*(Optional: Add a License section here if you wish, e.g., MIT License)*
````