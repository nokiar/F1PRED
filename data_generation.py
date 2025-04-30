import requests
import pandas as pd
import os

def download_f1_data():

    output_dir = os.path.join(os.getcwd(), "data_storage")
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    base_url = "http://ergast.com/api/f1/{year}/results.json?limit=100"
    start_year = 1950  
    current_year = 2025  

    for year in range(start_year, current_year + 1):
        print(f"Downloading data for year {year}...", flush=True)
        results = []
        offset = 0

        while True:
            # Fetch data from the API
            response = requests.get(base_url.format(year=year) + f"&offset={offset}")
            if response.status_code == 200:
                data = response.json()
                races = data.get('MRData', {}).get('RaceTable', {}).get('Races', [])
                if not races:
                    break  # Stop if no more data is available for this year
                for race in races:
                    for result in race.get('Results', []):
                        # Extract relevant race and result details
                        result_data = {
                            "season": race.get("season"),
                            "round": race.get("round"),
                            "raceName": race.get("raceName"),
                            "date": race.get("date"),
                            "driver": result.get("Driver", {}).get("familyName"),
                            "constructor": result.get("Constructor", {}).get("name"),
                            "position": result.get("position"),
                            "grid": result.get("grid"),
                            "laps": result.get("laps"),
                            "status": result.get("status"),
                            "time": result.get("Time", {}).get("time"),
                            "points": result.get("points"),
                        }
                        results.append(result_data)
                offset += 100  # Move to the next page
            else:
                print(f"Failed to fetch data for year {year}, offset {offset}, status code: {response.status_code}", flush=True)
                break

        if results:
            # Save the data to a CSV file
            df = pd.DataFrame(results)
            file_path = os.path.join(output_dir, f"f1_{year}.csv")
            df.to_csv(file_path, index=False)
            print(f"Data for year {year} saved to {file_path}", flush=True)
        else:
            print(f"No data found for year {year}", flush=True)

download_f1_data()
