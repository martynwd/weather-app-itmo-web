const apiUrl = 'http://api.openweathermap.org/data/2.5/weather?'
const appid = '8cac7f2e75696a4b18be15838553f1cb'
const getCurrentLocation = ()=> {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(show, onPermissionError)
    } else {

    }
}
const onPermissionError = (error) => {
    if (error.code == error.PERMISSION_DENIED){
        const geoParams = {
            id: '498698',
            appid: appid
        }
        getInfo(geoParams)
    }
      
}
 const show = (data)=>{
     console.log(data)
     const geoParams = {
         lat: data.coords.latitude,
         lon: data.coords.longitude,
         appid: appid
     }
     getInfo(geoParams)
 }

 const getInfo = (geoParams)=>{
    const url = apiUrl + new URLSearchParams(geoParams).toString()
    fetch(url)
    .then((response =>{
       return response.json()
    }))
    .then(data => {
        console.log(data)
        updateCity(data, document.querySelector('.city-card_main'))
        console.log(document.querySelectorAll('.city-card_favorite'))
    })
 }

const updateCity = (weatherData, city)=> {
    city.getElementsByClassName('city-preview__name')[0].innerHTML = weatherData.name;
    const params = Array.from(city.getElementsByClassName('city-card__key-value'));
    city.getElementsByClassName('city-preview__degrees')[0].innerHTML = Math.round((weatherData.main.temp - 273)).toString() + 'C';
    setParams(params, weatherData)

    

}

const setParams = (params ,weatherData) => {
    params[0].getElementsByClassName('city-card__key')[0].innerHTML = 'Ветер'
    params[1].getElementsByClassName('city-card__key')[0].innerHTML = 'Облачность'
    params[2].getElementsByClassName('city-card__key')[0].innerHTML = 'Давление'
    params[3].getElementsByClassName('city-card__key')[0].innerHTML = 'Влажность'
    params[4].getElementsByClassName('city-card__key')[0].innerHTML = 'Координаты'

    params[0].getElementsByClassName('city-card__value')[0].innerHTML = weatherData.wind.speed + ' ' + degToCard(weatherData.wind.deg)
    params[1].getElementsByClassName('city-card__value')[0].innerHTML = weatherData.clouds.all
    params[2].getElementsByClassName('city-card__value')[0].innerHTML = weatherData.main.pressure
    params[3].getElementsByClassName('city-card__value')[0].innerHTML = weatherData.main.humidity
    params[4].getElementsByClassName('city-card__value')[0].innerHTML = '[ ' + weatherData.coord.lat + ', ' + weatherData.coord.lon + ' ]'
}
const degToCard = (deg) => {
    if (deg>11.25 && deg<=33.75){
      return "NNE";
    }else if (deg>33.75 && deg<=56.25){
      return "ENE";
    }else if (deg>56.25 && deg<=78.75){
      return "E";
    }else if (deg>78.75 && deg<=101.25){
      return "ESE";
    }else if (deg>101.25 && deg<=123.75){
      return "ESE";
    }else if (deg>123.75 && deg<=146.25){
      return "SE";
    }else if (deg>146.25 && deg<=168.75){
      return "SSE";
    }else if (deg>168.75 && deg<=191.25){
      return "S";
    }else if (deg>191.25 && deg<=213.75){
      return "SSW";
    }else if (deg>213.75 && deg<=236.25){
      return "SW";
    }else if (deg>236.25 && deg<=258.75){
      return "WSW";
    }else if (deg>258.75 && deg<=281.25){
      return "W";
    }else if (deg>281.25 && deg<=303.75){
      return "WNW";
    }else if (deg>303.75 && deg<=326.25){
      return "NW";
    }else if (deg>326.25 && deg<=348.75){
      return "NNW";
    }else{
      return "N"; 
    }
  }
getCurrentLocation()