const axios = require('axios');
import defultImg from '../media/airline.jpg';
// create new trip
class CreateTrips {
	constructor(
		countryName,
		cityName,
		img,
		weatherForecastData,
		day,
		month,
		year,
		curDate
	) {
		(this.countryName = countryName),
			(this.cityName = cityName),
			(this.img = img),
			(this.weatherForecastData = weatherForecastData),
			(this.day = day),
			(this.month = month),
			(this.year = year),
			(this.curDate = curDate);
	}
	// API REQUESTS

	// calculate avarage max and min temp weather
	avarageWeather() {
		let max = 0;
		let min = 0;
		this.weatherForecastData.forEach((day) => {
			max += day.app_max_temp;
			min += day.app_min_temp;
		});
		this.max_temp = Math.floor(max / this.weatherForecastData.length);
		this.min_temp = Math.floor(min / this.weatherForecastData.length);
		// random weather description
		this.condition = this.weatherForecastData[
			Math.floor(Math.random() * this.weatherForecastData.length - 1)
		].weather.description;
	}
	calculateTripTimings() {
		let years = this.year - this.curDate[0];
		let months = this.month - this.curDate[1];
		let days = this.day - this.curDate[2];
		if (years === 0 && months === 0 && days === 0) {
			this.daysleftToDeparting = `you trip is today`;
		} else {
			this.daysleftToDeparting = ` ${years} year and ${months} months and ${days} days`;
		}
		this.departingDate = `${this.year}, ${this.month}, ${this.day}`;
	}

	updateUI() {
		this.calculateTripTimings();
		this.avarageWeather();
		return {
			city: this.cityName,
			county: this.countryName,
			daysleftToDeparting: this.daysleftToDeparting,
			departingDate: this.departingDate,
			image: this.img,
			max_temp: this.max_temp,
			min_temp: this.min_temp,
			weatherCondition: this.condition,
		};
	}
}
// recive user input and current date
// call createTrip class
function UserInputsCreateTrips(input) {
	console.log(input);

	async function geonamesApi() {
		const { API_USERNAME } = await getKeys();
		const geonamesUrl = `http://api.geonames.org/searchJSON?q=${input.cityName}&maxRows=1&username=${API_USERNAME}`;
		try {
			const res = await axios.get(geonamesUrl);
			const { lat, lng, countryName, name } = res.data.geonames[0];
			weatherbitApi(lat, lng, countryName, name);
		} catch (err) {
			console.log(`${err} error GERONAME-API 🛑`);
		}
	}

	geonamesApi();

	async function weatherbitApi(lat, lng, countryName, cityName) {
		const { API_KEY_weather } = await getKeys();
		const waetherUrl = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lng}&country=${countryName}&key=${API_KEY_weather}`;
		try {
			const weatherData = await axios.get(waetherUrl);
			// forecast for 16 days from the current date
			const weatherForecastData = weatherData.data.data;
			// console.log(weatherForecastData);
			pixabayApi(countryName, cityName, weatherForecastData);
		} catch (err) {
			console.log(`${err} error WEATHERBITE-API 🛑`);
		}
	}
	async function pixabayApi(countryName, cityName, weatherForecastData) {
		const { API_KEY_pix } = await getKeys();
		const pixabayUrl = `https://pixabay.com/api/?key=${API_KEY_pix}&q=${cityName}`;
		try {
			const image = await axios.get(pixabayUrl);
			// taking the first img cuz of api returns the object inorder of download rate
			const img = image.data.hits[0].webformatURL;
			const newTrip = new CreateTrips(
				countryName,
				cityName,
				img,
				weatherForecastData,
				input.day,
				input.month,
				input.year,
				input.curDate
			);
			const trip_Details = newTrip.updateUI();
			// console.log(trip_Details);
			updateUI(trip_Details);
		} catch (err) {
			console.log(`${err} error PIXABAY-API 🛑`);
		}
	}
}
let trip_key = 0;
function updateUI(tripDetails) {
	console.log(tripDetails);
	const domObj = {
		trip_destenation: document.querySelector('.trip-destenation'),
		trip_departure: document.querySelector('.trip-departure'),
		trip_leaving: document.querySelector('.trip-leaving'),
		weather_temp: document.querySelector('.weather-temp'),
		trip_destenation: document.querySelector('.trip-destenation'),
		weather_condition: document.querySelector('.weather-condition'),
		destination_img: document.querySelector('.destination-img'),
		savedTrips_container: document.querySelector('.savedTrips_container'),
	};
	const destination = `Destination to : ${tripDetails.city}, ${tripDetails.county}`;
	const departurtingDate = `Departurting Date : ${tripDetails.departingDate}`;
	const daysleftToDeparting = `Your flight leaving after : ${tripDetails.daysleftToDeparting}`;
	const weather_Temp = `Weather Temp : High: ${tripDetails.max_temp} °C / Low:${tripDetails.min_temp} °C`;
	const condition = `Condition : ${tripDetails.weatherCondition}`;
	const img = `${tripDetails.image}`;

	console.log(tripDetails);
	domObj.trip_destenation.textContent = `${destination}`;
	domObj.trip_departure.textContent = `${departurtingDate}`;
	domObj.trip_leaving.textContent = `${daysleftToDeparting}`;
	domObj.weather_temp.textContent = ` ${weather_Temp}`;
	domObj.weather_condition.textContent = `${condition}`;
	domObj.destination_img.setAttribute('src', `${img}`);

	/****************************************Saving trips*/
	let tripExists = false;
	function savingTrip(e) {
		if (e.target.className === 'save_trip') {
			if (!tripExists) {
				trip_key++;
				tripExists = true;
				const htmlSavedTrip = `<div class="trip_content key${trip_key}">
				<div class="savedImg">
					<img src="${img}" alt="savedImg"/>
				</div>
				<div class="savedTripInfo">
					<h6 class="saved_destin">${destination}</h6>
					<h6 class="saved_deparDate">${departurtingDate}</h6>
					<h6 class="saved_temp">${weather_Temp}</h6>
					<h6 class="saved_weatherCond">${condition}</h6>
					<button class="delateSavedTrip-btn">Delete</button>
				</div>
			</div>`;
				domObj.savedTrips_container.insertAdjacentHTML(
					'beforeend',
					htmlSavedTrip
				);
			}
		} else if (e.target.className === 'delate_trip') {
			domObj.trip_destenation.textContent = ``;
			domObj.trip_departure.textContent = ``;
			domObj.trip_leaving.textContent = ``;
			domObj.weather_temp.textContent = ``;
			domObj.weather_condition.textContent = ``;
			domObj.destination_img.setAttribute('src', `${defultImg}`);
			tripExists = true;
		}
	}

	const save_trip_btn = document.querySelector('.trip_btn');
	save_trip_btn.addEventListener('click', savingTrip);
}

// Getting api keys form var env (BackEnd) --->  (IN ORDER TO KEEP OUR KEYS SECOUR)
// then Fire other api functions to handle each api requests from their source
async function getKeys() {
	try {
		const keys = await axios.get('http://localhost:3000/keys');
		const { API_KEY_pix, API_KEY_weather, API_USERNAME } = keys.data;
		return {
			API_KEY_pix,
			API_KEY_weather,
			API_USERNAME,
		};
	} catch (err) {
		console.log(
			`${err} this from our 3000 node server requiring api for API KEYS`
		);
	}
}

export { getKeys, UserInputsCreateTrips };
