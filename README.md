# 🏎️ F1PRED: AI-Powered Formula 1 Analysis and Prediction

## 🧠 Project Overview

**F1PRED** is a web application developed as a final year BSc (Hons) Computing project for the University of Worcester. It investigates the effectiveness of Artificial Intelligence (AI) models in predicting Formula 1 race outcomes.

The application enables users to:
- Explore historical F1 data (races, drivers, constructors, standings).
- View AI-generated win probability predictions for F1 races.

The project uses historical data from the [Ergast API](https://ergast.com/mrd/) and a Neural Network model built with TensorFlow/Keras. Key findings indicate:
- Moderate predictive accuracy.
- Significant influence of constructor performance.
- Challenges due to limited data and the sport's unpredictability.

---

## ✨ Features

- **Historical Data Browser** – View detailed results for races, drivers, constructors, and standings across F1 seasons (1950–present).
- **AI Predictions** – Select a season and round to view AI-generated win probability predictions.

---

## 🛠️ Technologies Used

### Frontend
- HTML, CSS, JavaScript (with jQuery)

### Backend (API & AI)
- Python
  - Flask (Web Framework)
  - Flask-CORS (API Communication)
  - TensorFlow / Keras (Machine Learning)
  - Pandas, NumPy (Data Handling)
  - Scikit-learn (Preprocessing)

### Other
- **Data Source:** [Ergast Developer API](https://ergast.com/mrd/)

---

## 📁 Project Structure

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
├── data_storage/         # Created by data_generation.py
│   └── f1_YYYY.csv       # CSV file per season
│
├── assets/               # Images, logos, etc.
│
├── data_generation.py    # Downloads historical data from Ergast API
├── index.html            # Main frontend HTML file
├── requirements.txt      # Python backend dependencies
└── README.md             # This file
```

---

## ⚙️ Setup and Installation

1. **Clone the repository**
   ```bash
   git clone <https://github.com/nokiar/F1PRED.git>
   cd F1PRED
   ```

2. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Generate Historical Data**
   ```bash
   python data_generation.py
   ```
   This fetches race data from the Ergast API and stores it in `data_storage/`.

---

## 🚀 Running the Application

### 1. Start the Backend (Prediction API)

From the root directory (`F1PRED`):

```bash
python predictions/pred.py
```

- Trains the AI model and starts the Flask server at `http://127.0.0.1:5000`.

> 💡 Keep this terminal running during use.

---

### 2. Start the Frontend

The frontend should be served via a local server to avoid CORS issues.

#### VS Code Live Server
- Install the "Live Server" extension.
- Right-click `index.html` → "Open with Live Server".

> 🔗 Make sure the backend at `http://127.0.0.1:5000` is running first.

---

## 👨‍💻 Author

- **Carlos Germa**

## 🧑‍🏫 Supervisor

- **Akinola Siyanbola**

---

