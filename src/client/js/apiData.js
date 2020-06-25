const axios = require('axios');
async function apiCallingOne() {
	const geonamesUrl =
		'http://api.geonames.org/searchJSON?q=toronto&maxRows=1&username=abdul2020';
	try {
		const res = await axios.get(geonamesUrl);
		// console.log(res);
		const { lat, lng, countryName } = res.data.geonames[0];
		apiCallingTwo(lat, lng, countryName);
	} catch (err) {
		console.log(`${err} error GERONAME-API 🛑`);
	}
}

async function apiCallingTwo(lat, lng, countryName) {
	try {
		const waetherUrl = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lng}&country=${countryName}&key=f1f6b2de665c4e3fb4aeed7502a046b9`;
		const weatherData = await axios.get(waetherUrl);
		// console.log(weatherData);
		apiCallingThree(countryName);
	} catch (err) {
		console.log(`${err} error WEATHERBITE-API 🛑`);
	}
}

async function apiCallingThree(countryName) {
	try {
		const pixabayUrl = `https://pixabay.com/api/?key=17201323-ae9beedc0b9967c3d4793239a&q=${countryName}`;
		const image = await axios.get(pixabayUrl);
		console.log(image);
	} catch (err) {
		console.log(`${err} error PIXABAY-API 🛑`);
	}
}

apiCallingOne();
export { apiCallingOne };
