////////////////* geolocation data fetch and function call*///////////////////

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
    setTimeout(getLocation, 40000); ////////auto refresh
  } else {
    document.querySelector('#date_data').textContent = "Geolocation is not supported by this browser.";
  }
}

function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      document.querySelector('#date_data').textContent = "User denied the request for Geolocation.";
      break;
    case error.POSITION_UNAVAILABLE:
      document.querySelector('#date_data').textContent = "Location information is unavailable.";
      break;
    case error.TIMEOUT:
      document.querySelector('#date_data').textContent = "The request to get user location timed out.";
      break;
    case error.UNKNOWN_ERROR:
      document.querySelector('#date_data').textContent = "An unknown error occurred.";
      break;
  }
}
async function showPosition(position) {
  const api_key = 'c17ed39e67639542d9c9bd937eb8c02d';
  const lat = position.coords.latitude;
  const long = position.coords.longitude;
  const weatherData = new weather(lat, long, api_key);
  await weatherData.getWearherData();
  const dateData = dateUpdate();
  weatherStat(weatherData.watherStatus);
  domChange(weatherData, dateData);
}


//////////////////////* weather api fetch *///////////////

class weather {
  constructor(lat, long, apiKey) {
    this.lat = lat;
    this.long = long;
    this.apiKey = apiKey;
  }
  async getWearherData() {
    const apiData = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${this.lat}&lon=${this.long}&appid=${this.apiKey}`);
    const weatherDetails = await apiData.json();
    this.cityName = weatherDetails.name;
    this.country = weatherDetails.sys.country;
    this.maxTemp = weatherDetails.main.feels_like;
    this.minTemp = weatherDetails.main.temp_min;
    this.temp = weatherDetails.main.temp;
    this.watherStatus = weatherDetails.weather[0].main;
  }
}



////////////////* DOM data change */////////////////

const domChange = async (weatherData, dateData) => {
  document.querySelector('.city_name').textContent = `${weatherData.cityName},${weatherData.country}`;
  document.querySelector('.cur_temp').innerHTML = `${celcius(weatherData.temp)} &deg;C`;
  document.querySelector('.min_max_data').innerHTML = `<span id="min">min</span>-temp: ${celcius(weatherData.minTemp)} &deg;C<br><span id="max">max</span>-temp:
  ${celcius(weatherData.maxTemp)} &deg;C`;
  document.getElementById('date_data').textContent = `${dateData.day} ${dateData.date} ${dateData.month} | ${roundNum(dateData.hour)}:${roundNum(dateData.minute)} ${dateData.timestamp}`;
}



/////////////////* fomatting Date */////////////////

const dateUpdate = () => {
  const dateDetails = {};
  const date = new Date();
  dateDetails.day = day(date.getDay());
  dateDetails.date = dateGet(date.getDate());
  dateDetails.month = month(date.getMonth());
  dateDetails.hour = hour(date.getHours());
  dateDetails.minute = date.getMinutes();
  dateDetails.timestamp = hourstatus(date.getHours());
  return dateDetails;
}

const day = (dayNo) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[dayNo];
}
const dateGet = (date) => {
  const i = parseInt(date) % 10;
  if (i === 1) {
    return `${roundNum(date)}st`;
  } else if (i === 2) {
    return `${roundNum(date)}nd`;
  } else if (i === 3) {
    return `${roundNum(date)}rd`;
  } else {
    return `${roundNum(date)}th`;
  }
}
const month = (monthNo) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months[monthNo];
}
const hour = (hour) => {
  if (hour > 12) {
    return hour - 12;
  } else {
    return hour;
  }
}
const hourstatus = (hour) => {
  if (hour > 12) {
    return `P.M`
  } else {
    return `A.M`
  }
}


////////// changing farenheit data to celcius//////////

const celcius = (data) => {
  const celcData = (data - 273.15);
  return (parseInt(celcData));
}


/////////// adding weather icon/////////////
const weatherStat = (status) => {
  const weatherstatus = document.querySelector('.weather_status');
  if (status === 'Clouds') {
    weatherstatus.innerHTML = `<i class="fas fa-cloud" style ="color: black;"></i>`;
  } else if (status === 'Rain') {
    weatherstatus.innerHTML = `<i class="fas fa-cloud-showers-heavy" style="color: grey;"></i>`;
  } else if (status === 'Haze' || status === 'Mist') {
    weatherstatus.innerHTML = `<i class="fas fa-smog" style="color: grey;"></i>`;
  } else if (status === 'Thunderstorm') {
    weatherstatus.innerHTML = `<i class="fas fa-cloud-showers-heavy" style="color: grey;"></i>`;
  } else {
    weatherstatus.innerHTML = `<i class="fas fa-sun" style="color: darkorange;"></i>`;
  }
}


///////////add zero before num/////////

const roundNum = (num) => {
  if (num < 10) {
    return `0${num}`
  } else {
    return num;
  }
}

/////////////////* event listner add *////////////

window.addEventListener('load', getLocation);
