const axios = require('axios');

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

// API REQUESTS
async function geonamesApi() {
	const { API_USERNAME } = await getKeys();
	const geonamesUrl = `http://api.geonames.org/searchJSON?q=Jeddah&maxRows=1&username=${API_USERNAME}`;
	try {
		const res = await axios.get(geonamesUrl);
		const { lat, lng, countryName, name } = res.data.geonames[0];
		// function to make sure the user enter a city name that existed
		// name === 'Jeddah' ? console.log(true) : console.log(false);

		// call nex api
		weatherbitApi(lat, lng, countryName);
	} catch (err) {
		console.log(`${err} error GERONAME-API 🛑`);
	}
}

async function weatherbitApi(lat, lng, countryName) {
	const { API_KEY_weather } = await getKeys();
	const waetherUrl = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lng}&country=${countryName}&key=${API_KEY_weather}`;
	try {
		const weatherData = await axios.get(waetherUrl);
		// forecast for 16 days from the current date
		// console.log(weatherData);
		const city_name = weatherData.data.city_name;
		pixabayApi(city_name);
	} catch (err) {
		console.log(`${err} error WEATHERBITE-API 🛑`);
	}
}

async function pixabayApi(city_name) {
	const { API_KEY_pix } = await getKeys();
	const pixabayUrl = `https://pixabay.com/api/?key=${API_KEY_pix}&q=${city_name}`;
	try {
		const image = await axios.get(pixabayUrl);
		console.log(image);
	} catch (err) {
		console.log(`${err} error PIXABAY-API 🛑`);
	}
}
// geonamesApi();

export { getKeys };
