const axios = require('axios');
// create new trip
class CreateTrips {
	constructor(trips) {
		this.trip = trips;
	}
	// API REQUESTS
	async geonamesApi() {
		const { API_USERNAME } = await getKeys();
		const geonamesUrl = `http://api.geonames.org/searchJSON?q=${this.trip.cityName}&maxRows=1&username=${API_USERNAME}`;
		try {
			const res = await axios.get(geonamesUrl);
			const { lat, lng, countryName, name } = res.data.geonames[0];
			this.lat = lat;
			this.lng = lng;
			this.countryName = countryName;
			this.cityName = name;

			// call nex api
			this.weatherbitApi();
			this.pixabayApi();
			this.calculateTripTimings();
		} catch (err) {
			console.log(`${err} error GERONAME-API 🛑`);
		}
	}

	async weatherbitApi() {
		const { API_KEY_weather } = await getKeys();
		const waetherUrl = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${this.lat}&lon=${this.lng}&country=${this.countryName}&key=${API_KEY_weather}`;
		try {
			const weatherData = await axios.get(waetherUrl);
			// forecast for 16 days from the current date
			const weatherForecastData = weatherData.data.data;
			/// random weather description
			this.condition =
				weatherForecastData[
					Math.floor(Math.random() * weatherForecastData.length - 1)
				].weather.description;

			this.avarageWeather(weatherForecastData);
			return {
				con: this.condition,
			};
		} catch (err) {
			console.log(`${err} error WEATHERBITE-API 🛑`);
		}
	}

	// calculate avarage max and min temp weather
	avarageWeather(weatherData) {
		let max = 0;
		let min = 0;
		weatherData.forEach((day) => {
			max += day.app_max_temp;
			min += day.app_min_temp;
		});
		this.max_temp = Math.floor(max / weatherData.length);
		this.min_temp = Math.floor(min / weatherData.length);
	}

	async pixabayApi() {
		const { API_KEY_pix } = await getKeys();
		const pixabayUrl = `https://pixabay.com/api/?key=${API_KEY_pix}&q=${this.trip.cityName}`;
		try {
			const image = await axios.get(pixabayUrl);
			// taking the first img cuz of api returns the object inorder of download rate

			this.img = image.data.hits[0].webformatURL;
		} catch (err) {
			console.log(`${err} error PIXABAY-API 🛑`);
		}
	}

	calculateTripTimings() {
		let years = this.trip.year - this.trip.curDate[0];
		let months = this.trip.month - this.trip.curDate[1];
		let days = this.trip.day - this.trip.curDate[2];
		if (years === 0 && months === 0 && days === 0) {
			this.daysleftToDeparting = `you trip is today`;
		} else {
			this.daysleftToDeparting = `you trip is after ${years} year and ${months} months and ${days} days`;
		}
		this.departingDate = `${this.trip.year},${this.trip.month},${this.trip.day},`;
	}
}
// recive user input and current date
// call createTrip class
function UserInputsCreateTrips(input) {
	const trip = new CreateTrips(input);
	trip.geonamesApi();
	console.log(trip);
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
