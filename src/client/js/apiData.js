const axios = require('axios');

// Getting api keys form var env (BackEnd) --->  (IN ORDER TO KEEP OUR KEYS SECOUR)
// then Fire other api functions to handle each api requests from their source
async function getKeys() {
	try {
		const keys = await axios.get('http://localhost:3000/keys');
		const { API_KEY_pix, API_KEY_weather, API_USERNAME } = keys.data;
		getApiKeys(API_USERNAME, API_KEY_weather, API_KEY_pix);
	} catch (err) {
		console.log(
			`${err} this from our 3000 node server requiring api for API KEYS`
		);
	}
}

// API REQUESTS
async function getApiKeys(geoKey, weatherKey, pixKey) {
	async function geonamesApi() {
		const geonamesUrl = `http://api.geonames.org/searchJSON?q=toronto&maxRows=1&username=${geoKey}`;
		try {
			const res = await axios.get(geonamesUrl);
			const { lat, lng, countryName, name } = res.data.geonames[0];
			// name === 'Toronto' ? console.log(true) : console.log(false);
			// function to make sure the user enter a city name

			// call nex api
			weatherbitApi(lat, lng, countryName);
		} catch (err) {
			console.log(`${err} error GERONAME-API 🛑`);
		}
	}

	async function weatherbitApi(lat, lng, countryName) {
		const waetherUrl = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lng}&country=${countryName}&key=${weatherKey}`;
		try {
			const weatherData = await axios.get(waetherUrl);
			// forecast for 16 days from the current date
			// console.log(weatherData);
			pixabayApi(countryName);
		} catch (err) {
			console.log(`${err} error WEATHERBITE-API 🛑`);
		}
	}

	async function pixabayApi(countryName) {
		const pixabayUrl = `https://pixabay.com/api/?key=${pixKey}&q=${countryName} flag`;

		try {
			const image = await axios.get(pixabayUrl);
			console.log(image);
		} catch (err) {
			console.log(`${err} error PIXABAY-API 🛑`);
		}
	}
	geonamesApi();
}

export { getApiKeys, getKeys };
