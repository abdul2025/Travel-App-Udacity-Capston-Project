const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
const fs = require('fs');

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
// read user email and password
function readUserRegistration() {
	return new Promise((resolve, reject) => {
		fs.readFile('src/data/userRegister.json', (err, data) => {
			if (err) return reject(err);
			const result = JSON.parse(data);
			resolve(result);
		});
	});
}
// add email and password to data
app.post('/singup', (req, res) => {
	console.log('got requests singup');
	const body = req.body;
	const user = {};
	readUserRegistration().then((result) => {
		const email = body.email;
		function emailExists(users) {
			return users.email === email;
		}
		const existed = result.users.find(emailExists);
		console.log(existed);
		if (existed == undefined) {
			user['id'] = result.users.length + 1;
			user['email'] = body.email;
			user['password'] = body.password;
			Object.assign(user, body);
			result.users.push(user);
			// write over our existed file
			fs.writeFile(
				'src/data/userRegister.json',
				JSON.stringify(result, null, 2),
				(err) => {
					if (err) console.log(err);
				}
			);
			res.send('added');
		} else {
			res.send('existed');
		}
	});
});
// send login data for login verify
app.get('/login', (req, res) => {
	console.log('got requests login');
	readUserRegistration().then((result) => {
		res.send(result);
	});
});
