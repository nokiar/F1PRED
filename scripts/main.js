//URL base de la API
const API_BASE_URL = "https://api.jolpi.ca/ergast/f1/";
const API_BASE_URL2 = "https://api.openf1.org/v1/";

//API 1

    //Función para obtener datos desde la API
    async function fetchData(endpoint, query) {
        try {
            const response = await fetch(endpoint + query);
            if (!response.ok) throw new Error("Error al obtener los datos");
            const data = await response.json();
            //console.log(data); //Imprime los datos por consola
            return data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async function fetchData2(endpoint, query) {
        try {
            const response = await fetch(endpoint + query);
            if (!response.ok) throw new Error("Error al obtener los datos");
            const data = await response.json();
            //console.log(data); //Imprime los datos por consola
            return data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    $("#logoIni").on("click", function() {

        $("#races, #drivers, #constructors, #predictions").css("color", "white");
        $("#content").children().remove();

        $("#content").append(`
            <main>
                <section id="content">
                    <h2 style="text-align: center; color: white; font-size: 2em;">Welcome</h2>
                    <div style="display: flex; justify-content: center; align-items: center;">
                        <p style="max-width: 600px; text-align: center; font-size: 1.5em; color: white;">
                            F1PRED is a cutting-edge artificial intelligence system designed to transform Formula 1 race predictions. Leveraging advanced machine learning algorithms and comprehensive historical data, F1PRED offers unparalleled insights into race outcomes, driver performance, and championship standings.
                        </p>
                    </div>
                    <div style="display: flex; justify-content: center; align-items: center; gap: 10px; margin-top: 40px;">
                        <img src="assets/f11.jpg" alt="Photo 1" style="width: 600px; height: auto;">
                        <img src="assets/f12.jpg" alt="Photo 2" style="width: 600px; height: auto;">
                        <img src="assets/f13.jpg" alt="Photo 3" style="width: 600px; height: auto;">
                    </div>
                </section>
            </main>
        `);

    });

//Event listeners for buttons in the welcome section
$("#goToRaces").on("click", function () {
    $("#races").trigger("click");
});

$("#goToDrivers").on("click", function () {
    $("#drivers").trigger("click");
});

$("#goToStandings").on("click", function () {
    $("#standings").trigger("click");
});

$("#goToConstructors").on("click", function () {
    $("#constructors").trigger("click");
});

$("#goToPredictions").on("click", function () {
    $("#predictions").trigger("click");
});

    $("#races").on("click", function() {

        $("#races").css("color", "red");
        $("#drivers, #constructors, #predictions, #standings").css("color", "white");
            
        $("#content").children().remove();

        $("#content").append("<div id='selectionContainer'></div>");

        $("#selectionContainer").append("<div id='racesTitle'><h1>Races</h1></div>");

        let yearSelect = '<select id="raceYearInput">';

        for (let year = 2025; year >= 1950; year--) {
            yearSelect += `<option value="${year}">${year}</option>`;
        }

        yearSelect += '</select>';

        $("#selectionContainer").append("<div id='searchControls'></div>");

        $("#searchControls").append(yearSelect);

        $("#searchControls").append('<button id="searchYearButton">Search</button>');

        $("#searchYearButton").on("click", function() {
            loadRaces($("#raceYearInput").val());
        });

        loadRaces($("#raceYearInput").val());
    
    });

    $("#drivers").on("click", function() {

        $("#drivers").css("color", "red");
        $("#races, #constructors, #predictions, #standings").css("color", "white");

        $("#content").children().remove();

        $("#content").append("<div id='selectionContainer'></div>");

        $("#selectionContainer").append("<div id='driversTitle'><h1>Drivers</h1></div>");

        let yearSelect = '<select id="driverYearInput">';
        for (let year = 2025; year >= 1950; year--) {
            yearSelect += `<option value="${year}">${year}</option>`;
        }
        yearSelect += '</select>';

        $("#selectionContainer").append("<div id='searchControls'></div>");
        $("#searchControls").append(yearSelect);
        $("#searchControls").append('<button id="searchYearButton">Search</button>');

        $("#searchYearButton").on("click", function() {
            loadDriversSeparator($("#driverYearInput").val());
        });

        loadDriversSeparator($("#driverYearInput").val());

    });

    $("#constructors").on("click", function() {

            $("#constructors").css("color", "red");
            $("#drivers, #races, #predictions, #standings").css("color", "white");
            
            $("#content").children().remove();
    
            $("#content").append("<div id='selectionContainer'></div>");
    
            $("#selectionContainer").append("<div id='constructorsTitle'><h1>Constructors</h1></div>");
    
            let yearSelect = '<select id="constructorYearInput">';
            for (let year = 2025; year >= 1950; year--) {
                yearSelect += `<option value="${year}">${year}</option>`;
            }
            yearSelect += '</select>';
    
            $("#selectionContainer").append("<div id='searchControls'></div>");
            $("#searchControls").append(yearSelect);
            $("#searchControls").append('<button id="searchYearButton">Search</button>');
    
            $("#searchYearButton").on("click", function() {
                loadConstructors($("#constructorYearInput").val());
            });
    
            loadConstructors($("#constructorYearInput").val());
    
    });

    //DRIVERS

    function loadDriversSeparator(inputYear){

        $("#detailsContainer").remove();
            
        if(inputYear >= 2023){
            loadDrivers2(inputYear);
        }else{
            loadDrivers1(inputYear);
        }
    }

    function loadDrivers1(driverYearInput) {
        $("#detailsContainer").remove();
        showLoading();
        console.log("Loading drivers for year: " + driverYearInput);

        drivers = new Array();

        fetchData(API_BASE_URL, driverYearInput + "/drivers/").then(data => {
            if (data && data.MRData && data.MRData.DriverTable && data.MRData.DriverTable.Drivers) {
                data.MRData.DriverTable.Drivers.forEach(driver => {
                    drivers.push(driver);
                });

                //RENDER DRIVERS
                $("#content").append('<div id="detailsContainer"></div>');
                drivers.forEach(driver => {
                    console.log(driver);
                    const driverInfo = `
                    <div id="driverCard">
                        <p style="font-size: 20px;">${(driver.givenName).toUpperCase()} ${(driver.familyName).toUpperCase()}</p>
                        <p>${(driver.nationality).toUpperCase().substring(0, 3)}</p>
                        <p>${driver.permanentNumber}</p>
                    </div>
                    `;
                    $("#detailsContainer").append(driverInfo);
                });

            } else {
                console.error("No se encontraron datos de pilotos");
            }
        }).catch(error => {
            console.error("Error al obtener los datos de los pilotos:", error);
        }).finally(() => {
            hideLoading();
        });
    }

    function loadDrivers2(driverYearInput) {
        $("#detailsContainer").remove();
        showLoading();

        raceList = new Array();
        driverList = new Array();

        fetchData2(API_BASE_URL2, "meetings?year=" + driverYearInput).then(data => {
            if (data) {
                //RENDER DRIVERS
                $("#content").append('<div id="detailsContainer"></div>');

                data.forEach(meeting => {
                    raceList.push(meeting.meeting_key);
                });

                console.log(raceList);

                for (const meeting of raceList) {
                    fetchData2(API_BASE_URL2, "/drivers?meeting_key=" + meeting).then(data => {
                        if (data) {
                            data.forEach(driver => {
                                if (!driverList.some(existingDriver => existingDriver.full_name === driver.full_name)) {
                                    driverList.push(driver);
                                    const driverInfo = `
                                    <div id="infoCard2">
                                        <div>
                                            <img src="${driver.headshot_url}" alt="${driver.full_name}'s headshot">
                                        </div>
                                        <div>
                                            <p style="font-size: 25px;"><a style="color:#${driver.team_colour}; font-size: 25px; font-family:arial">${driver.driver_number}</a>${driver.broadcast_name}</p>
                                            <p>${driver.country_code}</p>
                                            <p><span style="display:inline-block; width:7.5px; height:12px; background-color:#${driver.team_colour};"></span> ${driver.team_name} </p>
                                        </div>
                                    </div>
                                    `;
                                    $("#detailsContainer").append(driverInfo);
                                }
                            });

                        } else {
                            console.error("No se encontraron datos de pilotos");
                        }
                    }).catch(error => {
                        console.error("Error al obtener los datos de los pilotos:", error);
                    });
                }

                console.log(driverList);

            } else {
                console.error("No se encontraron datos de pilotos");
            }
        }).catch(error => {
            console.error("Error al obtener los datos de los pilotos:", error);
        }).finally(() => {
            hideLoading();
        });
    }

    //CONSTRUCTORS

    function loadConstructors(constructorYearInput){

        $("#detailsContainer").remove();

        console.log("Loading constructors for year: "+constructorYearInput);

        constructors = new Array();

        fetchData(API_BASE_URL, constructorYearInput +"/constructors/").then(data => {
            if (data && data.MRData && data.MRData.ConstructorTable && data.MRData.ConstructorTable.Constructors) {
                data.MRData.ConstructorTable.Constructors.forEach(constructor => {
                    constructors.push(constructor);
                });

                //RENDER CONSTRUCTORS

                $("#content").append('<div id="detailsContainer"></div>');
                constructors.forEach(constructor => {
                    console.log(constructor);
                    const constructorInfo = `
                    <div id="infoCard">
                        <p style="font-size: 20px;">${(constructor.name).toUpperCase()}</p>
                        <p>${(constructor.nationality).toUpperCase().substring(0,3)}</p>
                    </div>
                    `;
                    $("#detailsContainer").append(constructorInfo);
                });
        }}).catch(error => {
            console.error("Error al obtener los datos de los pilotos:", error);
        });

    }
    
    //RACES

    function showLoading() {
        $("#content").append('<div id="loading" style="color: white; text-align: center; font-size: 2em;">Loading...</div>');
    }

    function hideLoading() {
        $("#loading").remove();
    }

    function loadRaces(raceYearInput) {
        $("#detailsContainer").remove();
        showLoading();
        console.log("Loading races for year: " + raceYearInput);
        obtenerTodasLasCarreras(raceYearInput);
    
        async function obtenerTodasLasCarreras(raceYearInput) {
            const baseUrl = "https://api.jolpi.ca/ergast/f1/" + raceYearInput + "/results/";
            const carreras = new Map();
            let offset = 0;
            const limit = 100; //Increase limit to fetch more results per request
            let total = null;
    
            try {
                //Bucle para realizar fetch hasta que se obtengan todos los datos
                while (total === null || offset < total) {
                    //Construir la URL con el offset y el límite
                    const url = `${baseUrl}?limit=${limit}&offset=${offset}`;
                    //console.log(`Fetching: ${url}`);
    
                    //Realizar la solicitud a la API
                    const response = await fetch(url);
                    if (!response.ok) {
                        throw new Error(`Error en la solicitud: ${response.status}`);
                    }
    
                    const data = await response.json();
    
                    //Obtener el total de resultados en la primera iteración
                    if (total === null) {
                        total = parseInt(data.MRData.total, 10);
                        console.log(`Total de resultados: ${total}`);
                    }
    
                    //Agregar las carreras al map para evitar duplicados
                    if (data.MRData.RaceTable.Races.length > 0) {
                        data.MRData.RaceTable.Races.forEach(race => {
                            carreras.set(race.round, race);
                        });
                    }
    
                    //Incrementar el offset para la siguiente página
                    offset += limit;
    
                    //Añadir un retraso para evitar demasiadas solicitudes
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
    
                const uniqueCarreras = Array.from(carreras.values());
                console.log(uniqueCarreras);
    
                //Render carreras
                $("#content").append('<div id="detailsContainer"></div>');
    
                uniqueCarreras.forEach((carrera, index) => {
                    const carreraInfo = `
                    <div id="raceCard">
                        <div id="raceTitle" style="display: flex; vertical-align: middle; align-items: center;font-size: 20px;">
                            <p style="font-family:arial">${(carrera.round).toUpperCase()}.</p>
                            <p>${(carrera.raceName).toUpperCase()}</p>
                        </div>
                        <div id="raceDesc" style="display: flex; vertical-align: middle; flex-direction: column;">
                            <p>${(carrera.Circuit.circuitName).toUpperCase()}, ${(carrera.Circuit.Location.country).toUpperCase()}</p>
                            <p>${(carrera.date).toUpperCase()}</p>
                        </div>
                        <div id="raceGridResults${index}">
                        </div>
                    </div>
                    `;
    
                    $("#detailsContainer").append(carreraInfo);
    
                    const raceGridResults = carrera.Results.map(result => {
                        return `
                        <div id="driverResult">
                            <p>${result.position}. ${result.Driver.givenName} ${result.Driver.familyName}</p>
                        </div>
                        `;
                    }).join('');
    
                    $(`#raceGridResults${index}`).append(raceGridResults);
                });
    
            } catch (error) {
                console.error("Error al obtener las carreras:", error);
                return [];
            } finally {
                hideLoading();
            }
        }
    }

    $("#standings").on("click", function () {
        $("#standings").css("color", "red");
        $("#races, #drivers, #constructors, #predictions").css("color", "white");
      
        $("#content").children().remove();
      
        $("#content").append("<div id='standingsContainer'></div>");
      
        $("#standingsContainer").append("<div id='standingsTitle'><h1>Standings</h1></div>");
      
        let yearSelect = '<select id="standingsYearInput">';
        for (let year = 2025; year >= 1950; year--) {
          yearSelect += `<option value="${year}">${year}</option>`;
        }
        yearSelect += "</select>";
      
        $("#standingsContainer").append("<div id='standingsControls'></div>");
        $("#standingsControls").append(yearSelect);
        $("#standingsControls").append('<button id="searchStandingsButton">Search</button>');
      
        $("#searchStandingsButton").on("click", function () {
          loadStandings($("#standingsYearInput").val());
        });
      
        loadStandings($("#standingsYearInput").val());
      });
      
      function loadStandings(year) {
        $("#standingsDetails").remove();
        showLoading();
      
        const driverStandingsEndpoint = `${API_BASE_URL}${year}/driverStandings.json`;
        const constructorStandingsEndpoint = `${API_BASE_URL}${year}/constructorStandings.json`;
      
        Promise.all([fetchData(driverStandingsEndpoint, ""), fetchData(constructorStandingsEndpoint, "")])
          .then(([driverData, constructorData]) => {
            $("#content").append('<div id="standingsDetails" style="text-align: center;"></div>');
      
            //Driver Standings
            if (driverData && driverData.MRData.StandingsTable.StandingsLists.length > 0) {
              const driverStandings = driverData.MRData.StandingsTable.StandingsLists[0].DriverStandings;
              const driverList = `
                <div>
                  <h2 style="color: white;">Driver Standings</h2>
                  <div id="driverStandingsList">
                    ${driverStandings.map((driver, index) => `
                      <div class="standingsRow" style="color: ${index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? '#cd7f32' : 'white'};">
                        <span class="standingsName">
                          ${index + 1}. ${driver.Driver.givenName} ${driver.Driver.familyName} - 
                          <span style="color: #${driver.Constructors[0].team_colour};">${driver.Constructors[0].name}</span>
                        </span>
                        <span class="standingsPoints">${driver.points} Points</span>
                      </div>
                    `).join('')}
                  </div>
                </div>
              `;
              $("#standingsDetails").append(driverList);
            }
      
            //Constructor Standings
            if (constructorData && constructorData.MRData.StandingsTable.StandingsLists.length > 0) {
              const constructorStandings = constructorData.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
              const constructorList = `
                <div>
                  <h2 style="color: white;">Constructor Standings</h2>
                  <div id="constructorStandingsList">
                    ${constructorStandings.map((constructor, index) => `
                      <div class="standingsRow" style="color: ${index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? '#cd7f32' : 'white'};">
                        <span class="standingsName">${index + 1}. ${constructor.Constructor.name} </span>
                        <span class="standingsPoints">${constructor.points} Points</span>
                      </div>
                    `).join('')}
                  </div>
                </div>
              `;
              $("#standingsDetails").append(constructorList);
            }
          })
          .catch((error) => {
            console.error("Error loading standings:", error);
          })
          .finally(() => {
            hideLoading();
          });
      }

$("#predictions").on("click", function () {
    $("#predictions").css("color", "red");
    $("#races, #drivers, #constructors, #standings").css("color", "white");

    $("#content").children().remove();

    $("#content").append("<div id='predictionsContainer'></div>");

    $("#predictionsContainer").append("<div id='predictionsTitle'><h1>Predictions</h1></div>");

    let seasonSelect = '<select id="seasonInput">';
    for (let year = 2025; year >= 1950; year--) {
        seasonSelect += `<option value="${year}">${year}</option>`;
    }
    seasonSelect += '</select>';

    $("#predictionsContainer").append("<div id='predictionsControls'></div>");
    $("#predictionsControls").append(seasonSelect);
    $("#predictionsControls").append('<select id="roundInput"><option value="">Select a season first</option></select>');
    $("#predictionsControls").append('<button id="predictButton">Predict</button>');

    //Update rounds when a season is selected
    $("#seasonInput").on("change", function () {
        const selectedSeason = $(this).val();
        if (selectedSeason) {
            fetch(`http://127.0.0.1:5000/api/rounds?season=${selectedSeason}`) //Updated URL
                .then(response => {
                    if (!response.ok) throw new Error("Failed to fetch rounds");
                    return response.json();
                })
                .then(data => {
                    const rounds = data.rounds || [];
                    let roundOptions = rounds.map(round => `<option value="${round}">${round}</option>`).join('');
                    $("#roundInput").html(roundOptions);
                })
                .catch(error => {
                    console.error("Error fetching rounds:", error);
                    $("#roundInput").html('<option value="">Error loading rounds</option>');
                });
        } else {
            $("#roundInput").html('<option value="">Select a season first</option>');
        }
    });

    //Handle prediction button click
    $("#predictButton").on("click", function () {
        const selectedSeason = $("#seasonInput").val();
        const selectedRound = $("#roundInput").val();

        if (!selectedSeason || !selectedRound) {
            alert("Please select both a season and a round.");
            return;
        }

        showLoading();

        //Fetch country name for the Grand Prix
        fetch(`${API_BASE_URL}${selectedSeason}/${selectedRound}.json`)
            .then(response => {
                if (!response.ok) throw new Error("Failed to fetch race data");
                return response.json();
            })
            .then(raceData => {
                const country = raceData?.MRData?.RaceTable?.Races[0]?.Circuit?.Location?.country || "Unknown Country";
                const circuitName = raceData?.MRData?.RaceTable?.Races[0]?.Circuit?.circuitName || "Unknown Circuit";
                const grandPrixName = `${country} GP - ${circuitName}`;

                //Fetch predictions
                fetch(`http://127.0.0.1:5000/api/predict?season=${selectedSeason}&round=${selectedRound}`)
                    .then(response => {
                        if (!response.ok) throw new Error("Failed to fetch predictions");
                        return response.json();
                    })
                    .then(data => {
                        $("#detailsContainer").remove();
                        $("#content").append('<div id="detailsContainer"></div>');

                        const predictions = data.predictions || [];
                        if (predictions.length === 0) {
                            $("#detailsContainer").append("<p style='color: white;'>No predictions available for the selected season and round.</p>");
                        } else {
                            const raceName = `Race: ${selectedSeason} - Round ${selectedRound}`;
                            const predictionList = predictions.map((prediction, index) => `
                                <p style="font-size: 16px; color: ${index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? '#cd7f32' : 'white'};">
                                    ${index + 1}. ${(prediction.driver).toUpperCase()} - ${prediction.probability}%
                                </p>
                            `).join('');

                            const combinedCard = `
                                <div class="prediction-card">
                                    <h3>${raceName}</h3>
                                    <h4>${grandPrixName}</h4>
                                    ${predictionList}
                                </div>
                            `;

                            $("#detailsContainer").append(combinedCard);
                        }
                    })
                    .catch(error => {
                        console.error("Error fetching predictions:", error);
                        $("#detailsContainer").remove();
                        $("#content").append('<div id="detailsContainer"></div>');
                        $("#detailsContainer").append("<p style='color: white;'>Error fetching predictions. Please try again later.</p>");
                    })
                    .finally(() => hideLoading());
            })
            .catch(error => {
                console.error("Error fetching race data:", error);
                $("#detailsContainer").remove();
                $("#content").append('<div id="detailsContainer"></div>');
                $("#detailsContainer").append("<p style='color: white;'>Error fetching race data. Please try again later.</p>");
                hideLoading();
            });
    });
});

//Function to check if an element is partially in the viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom > 0
    );
}

//Add scroll event listener to animate cards
function animateCardsOnScroll() {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card) => {
        if (isInViewport(card) && !card.classList.contains('visible')) {
            card.classList.add('visible');
        }
    });
}

//Trigger animation on page load and scroll
window.addEventListener('scroll', animateCardsOnScroll);
window.addEventListener('load', animateCardsOnScroll);

//Toggle dropdown menu
document.getElementById('menu-toggle').addEventListener('click', function () {
  const dropdownMenu = document.getElementById('dropdown-menu');
  dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
});

//Close dropdown menu when clicking outside
document.addEventListener('click', function (event) {
  const menuButton = document.getElementById('menu-toggle');
  const dropdownMenu = document.getElementById('dropdown-menu');
  if (!menuButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
    dropdownMenu.style.display = 'none';
  }
});

//Sync dropdown menu links with main navigation
document.getElementById('dropdown-races').addEventListener('click', () => document.getElementById('races').click());
document.getElementById('dropdown-drivers').addEventListener('click', () => document.getElementById('drivers').click());
document.getElementById('dropdown-standings').addEventListener('click', () => document.getElementById('standings').click());
document.getElementById('dropdown-constructors').addEventListener('click', () => document.getElementById('constructors').click());
document.getElementById('dropdown-predictions').addEventListener('click', () => document.getElementById('predictions').click());




