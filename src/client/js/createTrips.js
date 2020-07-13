const axios = require('axios');
import defultImg from '../media/airline.jpg';
import {
	saveTripToLocalStorage,
	delateTripFromLocalStorage,
} from './toLocalStorage';
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
		curDate,
		subregion,
		capital,
		population,
		timezones,
		currencies,
		cioc
	) {
		(this.countryName = countryName),
			(this.cityName = cityName),
			(this.img = img),
			(this.weatherForecastData = weatherForecastData),
			(this.day = day),
			(this.month = month),
			(this.year = year),
			(this.curDate = curDate);
		this.subregion = subregion;
		this.capital = capital;
		this.population = population;
		this.timezones = timezones;
		this.currencies = currencies;
		this.cioc = cioc;
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

	// calculate Trip dates
	calculateTripTimings() {
		let years = this.year - this.curDate[0];
		let months = this.month - this.curDate[1];
		let days = this.day - this.curDate[2];
		const daysLeftInCurYear = (12 - this.curDate[1]) * 30 - this.curDate[2];
		if (years === 0 && months === 0 && days === 0) {
			this.daysleftToDeparting = `you trip is today`;
		} else if (years === 0) {
			/// days left in the same year
			this.daysleftToDeparting = `${
				(this.month - this.curDate[1]) * 30 + this.day - this.curDate[2]
			} days`;
		} else if (years === 1) {
			this.daysleftToDeparting = ` ${
				this.month * 30 - this.day + daysLeftInCurYear
			} days`;
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
			bookedDate: `${this.curDate[0]}-${this.curDate[1]}-${this.curDate[2]}, ${this.curDate[3]}:${this.curDate[4]}:${this.curDate[5]}`,
			subregion: this.subregion,
			capital: this.capital,
			population: this.population,
			timezones: this.timezones,
			currencies: this.currencies,
			cioc: this.cioc,
		};
	}
}

// recive user input and current date
// call createTrip class
function UserInputsCreateTrips(input) {
	console.log(input);

	/************************************Handle API errors and followed functions**************************************************************************/
	function updateUIAPIErr(message) {
		const apiErrContainer = document.querySelector('.handleApiErrors-layout');
		const closeLayout = document.getElementById('close-apiErro');
		const erroMess = document.querySelector('.errorMessages');
		apiErrContainer.style.display = 'grid';
		erroMess.textContent = message;
		closeLayout.addEventListener('click', () => {
			console.log('clicked');
			apiErrContainer.style.display = 'none';
		});
	}

	/// API REQUESTS
	async function geonamesApi() {
		const { API_USERNAME } = await getKeys();
		try {
			const geonamesUrl = `http://api.geonames.org/searchJSON?q=${input.cityName}&maxRows=1&username=${API_USERNAME}`;
			const res = await axios.get(geonamesUrl);
			const { lat, lng, countryName, name } = res.data.geonames[0];
			weatherbitApi(lat, lng, countryName, name);
		} catch (err) {
			updateUIAPIErr(`${err} error GERONAME-API 🛑, Please try again OR later`);
			console.log(`${err} error GERONAME-API 🛑`);
		}
	}

	geonamesApi();

	async function weatherbitApi(lat, lng, countryName, cityName) {
		const { API_KEY_weather } = await getKeys();
		try {
			const waetherUrl = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lng}&country=${countryName}&key=${API_KEY_weather}`;
			const weatherData = await axios.get(waetherUrl);
			// forecast for 16 days from the current date
			const weatherForecastData = weatherData.data.data;
			// console.log(weatherForecastData);
			pixabayApi(countryName, cityName, weatherForecastData);
		} catch (err) {
			updateUIAPIErr(
				`${err} error WEATHERBITE-API 🛑, Please try again OR later`
			);
			console.log(`${err} error WEATHERBITE-API 🛑`);
		}
	}
	async function pixabayApi(countryName, cityName, weatherForecastData) {
		const { API_KEY_pix } = await getKeys();
		try {
			const pixabayUrl = `https://pixabay.com/api/?key=${API_KEY_pix}&q=${cityName}`;
			const image = await axios.get(pixabayUrl);
			// verify pixabay has image for entered cityName (obscure location)
			// taking the first img cuz of api returns the object inorder of download rate
			if (image.data.hits.length == 0) {
				const pixabayUrl = `https://pixabay.com/api/?key=${API_KEY_pix}&q=${countryName}`;
				const image = await axios.get(pixabayUrl);
				const img = image.data.hits[0].webformatURL;
				// console.log(image);
				/***********************Create TRIP*********************************************************/
				restcountriesAPI(countryName, cityName, weatherForecastData, img);
			} else {
				const img = image.data.hits[0].webformatURL;
				restcountriesAPI(countryName, cityName, weatherForecastData, img);
			}
		} catch (err) {
			updateUIAPIErr(`${err} error PIXABAY-API 🛑, Please try again OR later`);
			console.log(`${err} error PIXABAY-API 🛑`);
		}
	}
	async function restcountriesAPI(
		countryName,
		cityName,
		weatherForecastData,
		img
	) {
		try {
			const response = await axios.get(
				`https://restcountries.eu/rest/v2/name/${countryName}`
			);
			const restcountriesDate = response.data[0];
			console.log(restcountriesDate);
			/***********************Create TRIP*********************************************************/
			const newTrip = new CreateTrips(
				countryName,
				cityName,
				img,
				weatherForecastData,
				input.day,
				input.month,
				input.year,
				input.curDate,
				restcountriesDate.subregion,
				restcountriesDate.capital,
				restcountriesDate.population,
				restcountriesDate.timezones[0],
				restcountriesDate.currencies[0]['name'],
				restcountriesDate.cioc
			);
			const trip_Details = newTrip.updateUI();
			/*******************Update UI********************************/
			updateUI(trip_Details);
		} catch (err) {
			console.log(`${err} from RestCountries`);
			updateUIAPIErr(`${err} error PIXABAY-API 🛑, Please try again OR later`);
		}
	}
}

// add id to each trip //
let trip_key = localStorage.length;
//////*********************************Update UI adding trip, saving, deleting***************************************//
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
		save_trip_btn: document.querySelector('.trip_btn'),
		subregion: document.querySelector('.subregion'),
		capital: document.querySelector('.capital'),
		population: document.querySelector('.population'),
		timezones: document.querySelector('.timezones'),
		currencies: document.querySelector('.currencies'),
		cioc: document.querySelector('.cioc'),
	};
	const destination = `Destination to : ${tripDetails.city}, ${tripDetails.county}`;
	const departurtingDate = `Departurting Date : ${tripDetails.departingDate}`;
	const daysleftToDeparting = `Your flight leaving after : ${tripDetails.daysleftToDeparting}`;
	const weather_Temp = `Weather Temp : High: ${tripDetails.max_temp} °C / Low:${tripDetails.min_temp} °C`;
	const condition = `Condition : ${tripDetails.weatherCondition}`;
	const img = `${tripDetails.image}`;
	const bookedDate = tripDetails.bookedDate;

	// console.log(tripDetails);
	domObj.trip_destenation.textContent = `${destination}`;
	domObj.trip_departure.textContent = `${departurtingDate}`;
	domObj.trip_leaving.textContent = `${daysleftToDeparting}`;
	domObj.weather_temp.textContent = ` ${weather_Temp}`;
	domObj.weather_condition.textContent = `${condition}`;
	domObj.destination_img.setAttribute('src', `${img}`);
	domObj.subregion.textContent = `Subregion: ${tripDetails.subregion}`;
	domObj.capital.textContent = `Capital: ${tripDetails.capital}`;
	domObj.population.textContent = `Population: ${tripDetails.population}`;
	domObj.timezones.textContent = `Timezone: ${tripDetails.timezones}`;
	domObj.currencies.textContent = `Currencie: ${tripDetails.currencies}`;
	domObj.cioc.textContent = `Cioc: ${tripDetails.cioc}`;

	/****************************************Saving trips*************************************/
	let tripExists = false;
	let trips = [];
	function savingTrip(e) {
		if (e.target.className === 'save_trip') {
			if (!tripExists) {
				trip_key++;
				tripExists = true;
				const htmlSavedTrip = `<div class="trip_content" id="${trip_key}">
				<div class="savedImg">
				<h4 class="booked date">Booked date : ${bookedDate}</h4>
					<img src="${img}" alt="savedImg"/>
				</div>
				<div class="savedTripInfo">
					<h6 class="saved_destin">${destination}</h6>
					<h6 class="saved_deparDate">${departurtingDate}</h6>
					<h6 class="saved_daysleft">${daysleftToDeparting}</h6>
					<h6 class="saved_temp">${weather_Temp}</h6>
					<h6 class="saved_weatherCond">${condition}</h6>
					<button class="delateSavedTrip-btn">Delete</button>
				</div>
			</div>`;
				domObj.savedTrips_container.insertAdjacentHTML(
					'afterbegin',
					htmlSavedTrip
				);
				trips.push(htmlSavedTrip);
				/*****************************Save trip to local storage by trip id************************************/
				saveTripToLocalStorage(trips, trip_key);
			}

			/**********************************Deleting None saved TRIPs****************************************************/
		} else if (e.target.className === 'delate_trip') {
			domObj.trip_destenation.textContent = ``;
			domObj.trip_departure.textContent = ``;
			domObj.trip_leaving.textContent = ``;
			domObj.weather_temp.textContent = ``;
			domObj.weather_condition.textContent = ``;
			domObj.destination_img.setAttribute('src', `${defultImg}`);
			domObj.subregion.textContent = ``;
			domObj.subregion.textContent = ``;
			domObj.subregion.textContent = ``;
			domObj.subregion.textContent = ``;
			domObj.subregion.textContent = ``;
			domObj.subregion.textContent = ``;
			tripExists = true;
		}
	}

	domObj.save_trip_btn.addEventListener('click', savingTrip);
}

//// delete saved trips
document
	.querySelector('.savedTrips_container')
	.addEventListener('click', (e) => {
		if (e.target.className === 'delateSavedTrip-btn') {
			e.target.parentNode.parentNode.remove();
			console.log(e.target.parentNode.parentNode.id);
			/*****************************Delete trip from local storage by trip id************************************/
			delateTripFromLocalStorage(e.target.parentNode.parentNode.id);
		}
	});

// Getting api keys from var env (BackEnd) --->  (IN ORDER TO KEEP OUR KEYS SECOUR)
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
