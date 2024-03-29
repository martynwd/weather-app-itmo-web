const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?'
const appid = '8cac7f2e75696a4b18be15838553f1cb'

const getCurrentLocation = ()=> {
    //setLoading(true)
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


const findByName = (name, place, newCity) => {
  const geoParams = {
    q: name,
    appid: appid
}
    return getDefault(geoParams, place, newCity)
}


 const getDefault = (geoParams, city, newCity = false )=>{
  let cities = JSON.parse(localStorage.getItem('cities'))
  let input = document.querySelector('.form__input');
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
        if (data.id in cities && newCity){
          throw new Error('Такой город вы уже добавили')
        }
        updateCity(data, city)
        setLoading(false);
        return data;
    })
    .catch((error) =>{
      setLoading(false);
      input.value = ''
      alert(error.message)
      return Promise.reject()
    }))
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
    loader[0].style.display = state ? 'block' : 'none'
    container[0].style.display = state ? 'none' : 'block'
  }

  const addToFavorite = async (cityName, newCity) => {
    let favoriteList = document.getElementsByClassName('favorites-cities__list')
    let city = generateFavotiveCity()
    // console.log('city', city)

    try {
      await findByName(cityName, city.querySelector('.city-card_favorite'), newCity)
      .then((data)=> {
        console.log('blessrBF', data)
        city.querySelector('.city-preview__name').setAttribute('city_id', data.id)
        let favoriteCity = document.importNode(city, true)
        favoriteList[0].appendChild(favoriteCity)
        attachRemoveListeners()
      });
      return await findByName(cityName, city.querySelector('.city-card_favorite'), newCity)
    } catch (e) {
      return Promise.reject();
    }
  }
  

  const generateFavotiveCity = ()=>{
      // let favoriteCity = document.createElement('li');
      // favoriteCity.className = 'favorites-cities__item';

      // let favoriteCityCont = document.createElement('div');
      // favoriteCityCont.className = 'city-card city-card_favorite';

      // let preview = genarateCityPreview();

      // let params = document.createElement('ul');
      // params.className = 'city-card__params'
      // for (let i = 0; i < 5; i++){
      //   params.appendChild(generateParam())
      // }

      // favoriteCityCont.appendChild(preview);
      // favoriteCityCont.appendChild(params)
      // favoriteCity.appendChild(favoriteCityCont);

      let template = document.querySelector('#favorites-cities-card-template').content
      let favoriteCity = document.importNode(template, true)
      console.log(typeof favoriteCity)
      console.log('favcity', template)

      return template;

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
      event.preventDefault();
      if (input.value === ''){
        alert('Поле не должно быть пустое');
        return;
      }
      let cities = JSON.parse(localStorage.getItem('cities'));

      addToFavorite(input.value, true).then((data) =>{
        console.log('data', data)
          cities[data.id] = (input.value).toLowerCase();
          localStorage.setItem('cities', JSON.stringify(cities))
          input.value = '';
      })
      
      
  })
  refreshBtn.addEventListener('click', ()=>{
    getCurrentLocation()
  })
}
const attachRemoveListeners = () =>{
  let removeBtns = document.querySelectorAll('.city-preview__remove-btn')
  console.log(removeBtns)
  removeBtns.forEach((removeBtn) =>{
    removeBtn.addEventListener('click', ()=>{
      const mainList = removeBtn.parentNode.parentNode.parentNode.parentNode
      console.log('kist', mainList)
      if(removeBtn.parentNode.parentNode.parentNode !== null){
        console.log(removeBtn.parentNode.parentNode.parentNode)
        mainList.removeChild(removeBtn.parentNode.parentNode.parentNode)
      }
      
      let cities = JSON.parse(localStorage.getItem('cities'))
      for (var key in cities) {
        console.log('key', key)
        if (key === removeBtn.parentNode.querySelector('.city-preview__name').getAttribute('city_id')) {
          delete cities[key]
        };
        
    }
      localStorage.setItem('cities', JSON.stringify(cities))
      console.log(cities)
      
    })
    
  })

}
const setFavorites = () =>{
  if (localStorage.getItem('cities') === null) {
    localStorage.setItem('cities', JSON.stringify({}))
  }

  let cities = JSON.parse(localStorage.getItem('cities'))
  Object.values(cities).map(city => addToFavorite(city))
}

const init =  () =>{
  startListen()
  getCurrentLocation()
  setFavorites()
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

