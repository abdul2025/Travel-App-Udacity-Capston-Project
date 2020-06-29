const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();

dotenv.config();
app.use(cors());
// to use json
app.use(bodyParser.json()); // this strict - only parse object and arrays
// to use url encoded values
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);

app.use(express.static('dist'));

const port = process.env.PORT || 3000;
// designates what port the app will listen to for incoming requests
app.listen(port, function () {
	console.log(` app listening on port ${port}`);
});

// Get keys from Env
const { API_USERNAME, API_KEY_weather, API_KEY_pix } = process.env;
// Send keys to (FRONT_END)
app.get('/keys', (req, res) => {
	res.send({
		API_KEY_weather,
		API_KEY_pix,
		API_USERNAME,
	});
});
