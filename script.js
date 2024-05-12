// const API_key = "8f5e1194b0bc82c6ddc8c0eb3964526d";

// /*
const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector("[weather-container]");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInforContainer = document.querySelector(".user-info-container");

// Variable
let currentTab = userTab;
const API_KEY = "8f5e1194b0bc82c6ddc8c0eb3964526d";
currentTab.classList.add("current-tab");


// Initially ho skta hai Coords ho? to call kro
getfromSessionStorage();


function switchTab(clickedTab){

    if(clickedTab != currentTab){
        // removing the backgroun color
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        // adding the backgroun colour
        currentTab.classList.add("current-tab");

        // Agar iske ander active nhi hai to ise active kr do
        if(!searchForm.classList.contains("active")){
            userInforContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            errorscreen.classList.remove("active");
            searchForm.classList.add("active");
        }else{
            // mai pehle search wale tab me tha aur ab Your weather wala tab me hu
            searchForm.classList.remove("active");
            userInforContainer.classList.remove("active");
            errorscreen.classList.remove("active");
            // Display Weather from Local Storage
            getfromSessionStorage();
        }

    }

}

userTab.addEventListener("click", () => {
    // pass Clicked Tab as input parameter
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    // pass Clicked Tab as input parameter
    switchTab(searchTab);
});

// Check if Coordinates already present in storage
function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        // Local me coords nhi hai to grant access kro
        grantAccessContainer.classList.add("active");
    }else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }

}

const messageText = document.querySelector("[data-msgtext]");

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition, showError);

    }else{
        // HW show an alert for no geolocation support available
        grantAccessBtn.style.display = "none";
        messageText.innerText = "Geolocation is not supported by this browser.";
    }
}

function showError(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        messageText.innerText = "You denied the request for Geolocation.";
        break;
      case error.POSITION_UNAVAILABLE:
        messageText.innerText = "Location information is unavailable.";
        break;
      case error.TIMEOUT:
        messageText.innerText = "The request to get user location timed out.";
        break;
      case error.UNKNOWN_ERROR:
        messageText.innerText = "An unknown error occurred.";
        break;
    }
  }


function showPosition(position){
    // creating a local object for coordinates
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    };
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates); 
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);


async function fetchUserWeatherInfo(coordinates){
    const {lat, lon} = coordinates;
    // make grant Container invisible for loader
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");


    // API Call
    try{
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        
        if(res.status === 404){
            throw err;
        }

        // let tagg = document.createElement('p');
        // tagg.innerText = res;
        // document.body.appendChild(data);
        const data = await res.json();
        loadingScreen.classList.remove("active");
        userInforContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.add("active");
        // HW
    }
}

function renderWeatherInfo(weatherInfo){
    // api call wale data me se data nikalo
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[data-windSpeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    // we are using [0] becuase weather ke ander ek array hai 
    desc.innerText = weatherInfo?.weather?.[0]?.main;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windSpeed.innerText = `${weatherInfo?.wind?.speed.toFixed(2)}m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;

}


const searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityN = searchInput.value;
    if(cityN === ""){
        return;
    }else{
        fetchSearchWeatherInfo(cityN);
    }
}); 


const errorscreen = document.querySelector(".error-container");

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInforContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);

        if(response.status === 404){
            throw err;
        }

        const data = await response.json();
        loadingScreen.classList.remove("active");
        errorscreen.classList.remove("active");
        userInforContainer.classList.add("active");
        renderWeatherInfo(data);

    }catch(err){
        loadingScreen.classList.remove("active");
        errorscreen.classList.add("active");
    }

}
// */
