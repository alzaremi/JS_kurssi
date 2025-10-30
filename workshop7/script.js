// ============================
// HARJOITUS 1: JSONin perusteet
// ============================

// 1) JSON-teksti
const text = '{"employees": [' +
'{ "firstName":"John" , "lastName":"Doe"},' +
'{ "firstName":"Anna" , "lastName":"Smith"},' +
'{ "firstName":"Peter" , "lastName":"Jones"} ]}';

// 2) Parsitaan JSON kerran
let data;
try {
    data = JSON.parse(text); // Muutetaan teksti JS-olioksi
} catch (err) {
    document.getElementById('jsondata').textContent = "Virhe JSONin parsinnassa: " + err;
}

// 3) Funktio: näytä vain etu- ja sukunimet
function showNames() {
    if (!data || !data.employees) return;
    let out = '';
    data.employees.forEach(emp => {
        out += emp.firstName + ' ' + emp.lastName + '\n';
    });
    document.getElementById('jsondata').textContent = out;
}

// 4) Funktio: näytä kaikki tiedot siistissä muodossa
function showAll() {
    document.getElementById('jsondata').textContent = JSON.stringify(data, null, 2);
}

// 5) Liitetään nappeihin click-tapahtumat
document.getElementById('showNamesBtn').addEventListener('click', showNames);
document.getElementById('showAllBtn').addEventListener('click', showAll);


// ============================
// HARJOITUS 2: JSON verkosta
// ============================

// API-url
const movieURL = 'https://www.omdbapi.com/?s=star+wars&apikey=cbbc6750';

// 1) Lataa raaka JSON-data
async function loadRawData() {
    const rawDiv = document.getElementById('rawdata');
    rawDiv.textContent = "Ladataan dataa...";

    try {
        const response = await fetch(movieURL);
        if (!response.ok) throw new Error(`Virhe: ${response.status}`);
        const data = await response.text(); // Haetaan raakana tekstinä
        rawDiv.textContent = data; // Näytetään raaka JSON
    } catch (err) {
        rawDiv.textContent = "Virhe datan latauksessa: " + err;
    }
}

// 2) Lataa ja parsi JSON-data, näytä taulukkona
async function loadAndParseData() {
    const rawDiv = document.getElementById('rawdata');
    rawDiv.innerHTML = "Ladataan ja parsitaan dataa...";

    try {
        const response = await fetch(movieURL);
        if (!response.ok) throw new Error(`Virhe: ${response.status}`);
        const json = await response.json(); // Parsitaan JSON

        if (!json.Search) {
            rawDiv.textContent = "Dataa ei löytynyt.";
            return;
        }

        // Rakennetaan HTML-taulukko
        let out = `
            <table border="1" cellspacing="0" cellpadding="5">
                <tr>
                    <th>Elokuvan nimi</th>
                    <th>Vuosi</th>
                    <th>Juliste</th>
                </tr>
        `;
        json.Search.forEach(movie => {
            out += `
                <tr>
                    <td>${movie.Title}</td>
                    <td>${movie.Year}</td>
                    <td><img src="${movie.Poster}" alt="${movie.Title}" width="100"></td>
                </tr>
            `;
        });
        out += "</table>";
        rawDiv.innerHTML = out;
    } catch (err) {
        rawDiv.textContent = "Virhe datan parsinnassa: " + err;
    }
}

// 3) Liitetään nappeihin tapahtumat
document.getElementById('loadRawBtn').addEventListener('click', loadRawData);
document.getElementById('loadParsedBtn').addEventListener('click', loadAndParseData);


// ============================
// HARJOITUS 3: OpenWeatherMap API
// ============================

// API-avain (käytä omaa, tämä esimerkkinä)
const apiKey = "ff64c247a136f706923d1ee0d55d71e2";

// Funktio hakee säädatan annetulle kaupungille
async function fetchWeather(city) {
    const rawDiv = document.getElementById("rawWeather");
    const parsedDiv = document.getElementById("parsedWeather");

    rawDiv.textContent = "Haetaan...";
    parsedDiv.textContent = "";

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Virhe haussa: ${response.status}`);
        const data = await response.json();

        // Näytetään raaka JSON
        rawDiv.textContent = JSON.stringify(data, null, 2);

        // Poimitaan tärkeimmät tiedot
        const temp = data.main.temp;
        const humidity = data.main.humidity;
        const clouds = data.clouds.all;
        const description = data.weather[0].description;
        const icon = data.weather[0].icon;

        // Näytetään parsitut tiedot HTML:ssä
        parsedDiv.innerHTML = `
            <p><strong>Kaupunki:</strong> ${data.name}</p>
            <p><strong>Lämpötila:</strong> ${temp} °C</p>
            <p><strong>Kosteus:</strong> ${humidity} %</p>
            <p><strong>Pilvisyys:</strong> ${clouds} %</p>
            <p><strong>Kuvaus:</strong> ${description}</p>
            <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="sääkuvake">
        `;
    } catch (err) {
        rawDiv.textContent = "Virhe haussa: " + err.message;
        parsedDiv.textContent = "";
    }
}

// Liitetään tapahtumankuuntelijat nappeihin ja select-elementtiin
document.getElementById("getWeatherBtn").addEventListener("click", () => {
    const city = document.getElementById("citySelect").value;
    fetchWeather(city);
});

// Hae kirjoitetulla hakusanalla
document.getElementById("searchBtn").addEventListener("click", () => {
    const city = document.getElementById("citySearch").value.trim();
    if (city) fetchWeather(city);
    else alert("Kirjoita kaupungin nimi ennen hakua!");
});

// Kun käyttäjä vaihtaa valikon valintaa
document.getElementById("citySelect").addEventListener("change", (e) => {
    fetchWeather(e.target.value);
});
