const axios = require('axios');

async function geonamesApi() {
	const geonamesUrl =
		'http://api.geonames.org/searchJSON?q=toronto&maxRows=1&username=abdul2020';
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
	const waetherUrl = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lng}&country=${countryName}&key=${process.env.API_KEY_weather}`;
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
	const pixabayUrl = `https://pixabay.com/api/?key=17201323-ae9beedc0b9967c3d4793239a&q=${countryName} flag`;
	console.log(countryName);
	try {
		const image = await axios.get(pixabayUrl);
		// console.log(image);
	} catch (err) {
		console.log(`${err} error PIXABAY-API 🛑`);
	}
}

export { geonamesApi };
