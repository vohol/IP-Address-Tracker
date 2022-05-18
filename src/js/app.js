import * as dfltFunctions from "./modules/defaultFunctions.js";
dfltFunctions.isWebp();

const displayIP = document.getElementById('ip')
const displayLocation = document.getElementById('location')
const displayTimeZone = document.getElementById('timezone')
const displayIsp = document.getElementById('isp')
const displayMap = document.getElementById("map")
const inputIP = document.getElementById("set-ip")
const submitButton = document.querySelector(".search__btn")
const apiKey = '212a4c4de2344e28abf0db3b4f2b8f9d'

document.addEventListener('DOMContentLoaded', () => {
  json(`https://ipgeolocation.abstractapi.com/v1/?api_key=${apiKey}`)
    .then(data => {
      setupPage(data)
    })
})

submitButton.addEventListener('click', () => {
  setupIpFromInput()
})

document.addEventListener('keyup', (e) => {
  if (e.target.id == 'set-ip' && e.key == 'Enter') {
    setupIpFromInput()
  }
})



//FUNCTIONS
function initMap(newLat, newLng) {
  const uluru = { lat: newLat, lng: newLng };

  const map = new google.maps.Map(displayMap, {
    zoom: 10,
    center: uluru,
  });

  const image =
    "https://i.ibb.co/Lh8d7SH/location.png";

  const marker = new google.maps.Marker({
    position: uluru,
    map: map,
    icon: image,
  });

}

function json(url) {
  return fetch(url).then(res => res.json());
}

function setupPage(data) {
  displayIP.textContent = data.ip_address
  displayLocation.textContent = `${data.flag.emoji} ${data.country}, ${data.region}, ${data.city}`

  let gmtOffest = data.timezone.gmt_offset >= 0 ?
    `+${data.timezone.gmt_offset}`
    : data.timezone.gmt_offset;
  displayTimeZone.textContent = `${data.timezone.abbreviation} ${gmtOffest}`

  let isp = data.connection.autonomous_system_organization
  displayIsp.textContent = !isp ? isp = 'No Info' : isp;

  window.initMap = initMap(data.latitude, data.longitude)
}

function validateIPaddress(ipaddress) {
  if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
    return true
  }
  alert("You have entered an invalid IP address! Please, try again!")
  return false
}

function setupIpFromInput() {
  const ip = inputIP.value
  if (validateIPaddress(ip)) {
    json(`https://ipgeolocation.abstractapi.com/v1/?api_key=${apiKey}&ip_address=${ip}`)
      .then(data => {
        setupPage(data)
      })
  }
  inputIP.value = ''
}