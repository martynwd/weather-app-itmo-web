const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?'
const appid = '8cac7f2e75696a4b18be15838553f1cb'

const getCurrentLocation = ()=> {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(show, onPermissionError);
    }
}

const onPermissionError = (error) => {
    if (error.code == error.PERMISSION_DENIED){
        const geoParams = {
            id: '658225',
            appid: appid
        }
        getDefault(geoParams, document.querySelector('.city-card_main'))
    }
      
}
 const show = (data)=>{
     const geoParams = {
         lat: data.coords.latitude,
         lon: data.coords.longitude,
         appid: appid
     }

     getDefault(geoParams, document.querySelector('.city-card_main'))
 }


const findByName = (name, place) => {
  const geoParams = {
    q: name,
    appid: appid
}
    return getDefault(geoParams, place)
}


 const getDefault = (geoParams, city)=>{
   console.log('city', city)
    setLoading(true)
    const url = apiUrl + new URLSearchParams(geoParams).toString()
    return (fetch(url)
    .then((response =>{
      if (response.status === 404){
        throw new Error('Такого города увы не существует');
      }
      if (response.status === 401){
        throw new Error('Токен испортился');
      }
      if (response.status === 403){
        throw new Error('Forbiden');
      }
      if (response.status === 500){
        throw new Error('Внутренняя ошибка сервера');
      }
      if (response.status === 503){
        throw new Error('Сервис недоступен');
      }
       return response.json()
    }))
    .then(data => {
        updateCity(data, city)
        setLoading(false);
    })
    .catch((error) =>{
      setLoading(false);
      if (error.message !== 'Такого города увы не существует'){
        showError()
      }

      alert(error.message)
      return Promise.reject()
    }))
 }

const showError = () => {
  let loader = document.getElementsByClassName('loader');
  let container = document.getElementsByClassName('container');
  let errorDiv = document.getElementsByClassName('error_page');
  loader[0].style.display = 'none'
  container[0].style.display = 'none'
  errorDiv[0].style.display = 'block'
} 
const updateCity = (weatherData, city)=> {
    city.getElementsByClassName('city-preview__name')[0].innerHTML = weatherData.name;
    const params = Array.from(city.getElementsByClassName('city-card__key-value'));
    city.getElementsByClassName('city-preview__degrees')[0].innerHTML = Math.round((weatherData.main.temp - 273)).toString() + 'C';
    var iconurl = "http://openweathermap.org/img/w/" + weatherData.weather[0].icon + ".png";
    city.getElementsByClassName('city-preview__weather-icon')[0].src=iconurl
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


  const setLoading = (state) => {
    let loader = document.getElementsByClassName('loader');
    let container = document.getElementsByClassName('container');
    console.log('loaad')
    loader[0].style.display = state ? 'block' : 'none'
    container[0].style.display = state ? 'none' : 'block'
  }

  const addToFavorite = (cityName) => {
    let favoriteList = document.getElementsByClassName('favorites-cities__list')
    let city = generateFavotiveCity()
    return findByName(cityName, city.querySelector('.city-card_favorite')).then(()=>{
      favoriteList[0].appendChild(city)
    }).catch(()=>{
      return Promise.reject()
    })
  }
  

  const generateFavotiveCity = ()=>{
      let favoriteCity = document.createElement('li');
      favoriteCity.className = 'favorites-cities__item';

      let favoriteCityCont = document.createElement('div');
      favoriteCityCont.className = 'city-card city-card_favorite';

      let preview = genarateCityPreview();

      let params = document.createElement('ul');
      params.className = 'city-card__params'
      for (let i = 0; i < 5; i++){
        params.appendChild(generateParam())
      }

      favoriteCityCont.appendChild(preview);
      favoriteCityCont.appendChild(params)
      favoriteCity.appendChild(favoriteCityCont);

      return favoriteCity;

  }

  const genarateCityPreview = () => {
    let container = document.createElement('div');
    container.className = 'city-preview';

    let name = document.createElement('h3');
    name.className = 'city-preview__name';

    let deegres = document.createElement('p');
    deegres.className = 'city-preview__degrees';

    let picture = document.createElement('img');
    picture.className = 'city-preview__weather-icon city-preview__weather-icon_md';

    let deleteImg = document.createElement('img');
    deleteImg.className = "city-preview__remove-img";
    deleteImg.src = "./img/remove.svg";

    let span = document.createElement('span');

    let removeBtn = document.createElement('button');
    removeBtn.className = 'city-preview__remove-btn'
    removeBtn.addEventListener('click', ()=>{
      const mainList = removeBtn.parentNode.parentNode.parentNode.parentNode
      mainList.removeChild(removeBtn.parentNode.parentNode.parentNode)
      let cities = JSON.parse(localStorage.getItem('cities'))
      delete cities[name.innerHTML]
      localStorage.setItem('cities', JSON.stringify(cities))
      console.log(cities)
      
    })
    span.appendChild(deleteImg);
    removeBtn.appendChild(span);


    container.appendChild(name)
    container.appendChild(deegres)
    container.appendChild(picture)
    container.appendChild(removeBtn)

    return container
  }

  const generateParam = () => {
    let param = document.createElement('li');
    param.className = 'city-card__param';

    let card = document.createElement('div');
    card.className = 'city-card__key-value'

    let key = document.createElement('span')
    key.className = 'city-card__key'

    let value = document.createElement('span')
    value.className = 'city-card__value'

    card.appendChild(key)
    card.appendChild(value)

    param.appendChild(card)

    return param;
  }

const startListen = () => {
  let addBtn = document.querySelector('.form__submit')
  let refreshBtn = document.querySelector('.header__update-button')
  let input = document.querySelector('.form__input');
  addBtn.addEventListener('click', (event)=>{
      event.preventDefault()
      if (input.value === ''){
        alert('Поле не должно быть пустое');
        return;
      }
      let cities = JSON.parse(localStorage.getItem('cities'))
      if (input.value in cities){
        alert('ТАкой горож уже есть')
      } else {
        addToFavorite(input.value).then(() =>{
          console.log(input.value)
          if (input.value !== '')
          cities[input.value] = 1;
          localStorage.setItem('cities', JSON.stringify(cities))
        })
      }
    
  })
  refreshBtn.addEventListener('click', ()=>{
    getCurrentLocation()
  })
}

const setFavorites = () =>{
  if (localStorage.getItem('cities') === null) {
    localStorage.setItem('cities', JSON.stringify({}))
  }

  let cities = JSON.parse(localStorage.getItem('cities'))
  Object.keys(cities).map(city => addToFavorite(city))
}

const init =  () =>{
  setFavorites()
  startListen()
  getCurrentLocation()

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

init()