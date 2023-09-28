const userTab=document.querySelector("[data-yourWeather]");
const SearchTab=document.querySelector("[data-SearchWeather]");
const userContainer=document.querySelector(".weather-container");
const grantAccessContainer=document.querySelector(".grant-access-container");
const searchForm=document.querySelector("[data-searchForm]");
const loadingcontainer=document.querySelector(".loading-container");
const userInfocContainer=document.querySelector(".user-info-container")
// initially varaibles needed

let currentTab=userTab;
const API_KEY="588e557e16055d37f8313edcd14ac5e3";
currentTab.classList.add("current-tab");

getfromSessionStorage();

function switchTab(clickedTab)
{
    if(clickedTab!=currentTab)
    {
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active"))
        {  
            userInfocContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }

        else{
            //pehle mein searchtab pe tha ,ab mein yourweather wale tab pe hun 
            userInfocContainer.classList.remove("active");
            // grantAccessContainer.classList.add("active");
            searchForm.classList.remove("active");
 
            getfromSessionStorage();
        }
        }
}

userTab.addEventListener("click",()=>{
  //pass clicked tab as input
    switchTab(userTab);
})

SearchTab.addEventListener("click",()=>{
    //pass clicked tab as input
      switchTab(SearchTab);
})

function getfromSessionStorage()
{
    const localCoordinates=sessionStorage.getItem("user-coordinates");
    if(!localCoordinates)
    {
        grantAccessContainer.classList.add("active");
    }
    else{
        // userInfocContainer.classList.add("active");
        const coordinates=JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates)
{
  const {lat,lon}=coordinates;

  //make grantAccessContainer invisible
  grantAccessContainer.classList.remove("active");
  // make loader visible
  loadingcontainer.classList.add("active");

  //API call
  try{
    let res=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    let data=await res.json();
    loadingcontainer.classList.remove("active");
    userInfocContainer.classList.add("active");
    renderWeatherInfo(data);
  }
  catch(e){
      loadingcontainer.classList.remove("active");
      //hw
  }
}


function renderWeatherInfo(weatherInfo)
{
    // firstly we have to fetch the element
    const cityName=document.querySelector("[data-cityName]");
    const countryIco=document.querySelector("[data-countryIcon]");
    const desc=document.querySelector("[data-weatherDesc]");
    const weatherIcon=document.querySelector("[data-weatherIcon]");
    const temp=document.querySelector("[data-temp]");
    const windspeed=document.querySelector("[data-windspeed]");
    const humidity=document.querySelector("[data-humidity]");
    const clouds=document.querySelector("[data-cloud]");
    
    //fetch values from weatherInfo object and put it in UI elements
    cityName.innerText=weatherInfo?.name;
    desc.innerText=weatherInfo?.weather?.[0]?.description;
    weatherIcon.src=`http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText=weatherInfo?.main?.temp + " °C";
    humidity.innerText=weatherInfo?.main?.humidity +" %";
    windspeed.innerText=weatherInfo?.wind?.speed+' m/s';
    clouds.innerText=weatherInfo?.clouds?.all+" %";
    countryIco.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;

}


function getLocation()
{
    if(navigator.geolocation)
    {
       navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{

        alert("No geolocation support available");

    }
}

function showPosition(position)
{
     const userCoordinates={
        lat:position.coords.latitude,
        lon:position.coords.longitude,
     } 

     sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
     fetchUserWeatherInfo(userCoordinates);

}
const grantAccessBtn=document.querySelector("[data-grantAccess]");
grantAccessBtn.addEventListener("click", getLocation);


let searchInput=document.querySelector("[data-searchInput]")

searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName=searchInput.value;
    if(cityName==="")return;
     
    else{
        fetchSearchWeatherInfo(cityName);
    }
    
})

async function fetchSearchWeatherInfo(city)
{  
    loadingcontainer.classList.add("active");
    grantAccessContainer.classList.remove("active");
    userInfocContainer.classList.remove("active");
    try{
        let response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        let data=await response.json();
        loadingcontainer.classList.remove("active");
        userInfocContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(e)
    {

    }
}