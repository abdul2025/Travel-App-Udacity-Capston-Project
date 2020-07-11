import { UserInputsCreateTrips } from './createTrips';
import airlineImg from '../media/airline.jpg';

(function () {
	const domObj = {
		search_bar: document.querySelector('.search-bar'),
		search_btn: document.getElementById('btn-search'),
		search_city_input: document.getElementById('searchCity'),
		trip_date_input: document.getElementById('trip-date'),
		btn_loging: document.querySelector('.btn-loging'),
		loging_overlay: document.querySelector('.loging-overlay'),
		btn_sign: document.querySelector('.btn-sign'),
		sign_overla: document.querySelector('.sign-overlay'),
		close_sign: document.querySelector('#close-sign'),
		close_login: document.querySelector('#close-loging'),
		dateErrMesg: document.querySelector('.dateErrMesg'),
		trip_container: document.querySelector('.trip-container'),
	};

	// defult_img
	function destinationImg(img) {
		const imgTag = document.createElement('img');
		imgTag.src = `${img}`;
		imgTag.alt = 'destination img';
		imgTag.setAttribute('class', 'destination-img');
		domObj.trip_container.insertAdjacentElement('afterbegin', imgTag);
	}
	destinationImg(airlineImg);

	///show up layout
	function showLayout(btn, layout) {
		btn.addEventListener('click', function () {
			this.style.backgroundColor = '#25626c';
			layout.style.display = 'block';
		});
	}

	showLayout(domObj.btn_loging, domObj.loging_overlay);
	showLayout(domObj.btn_sign, domObj.sign_overla);

	// close layout
	function closeLayout(btn, layout, opened) {
		btn.addEventListener('click', function () {
			layout.style.display = 'none';
			opened.style.backgroundColor = '#3da4b5';
		});
	}

	closeLayout(domObj.close_sign, domObj.sign_overla, domObj.btn_sign);
	closeLayout(domObj.close_login, domObj.loging_overlay, domObj.btn_loging);

	// Get current date
	function currentDate() {
		let date, day, month, year, months, hour, min, sec;
		date = new Date();
		day = date.getDate();
		month = date.getMonth();
		year = date.getFullYear();
		hour = date.getHours();
		min = date.getMinutes();
		sec = date.getSeconds();
		return [year, month + 1, day, hour, min, sec];
	}
	/**************************User inputs verifications*******************************/
	function userInputsVerification() {
		const curDate = currentDate();
		const userCityInput = domObj.search_city_input.value;
		const userTripDateInput = domObj.trip_date_input.value;
		const city = userCityInput.split(',');
		const cityName = city[0];
		const date = userTripDateInput.split('-');
		let userDates = [];
		date.forEach((e) => {
			userDates.push(Number(e));
		});

		function updateUIData(message) {
			domObj.dateErrMesg.textContent = message;
			domObj.dateErrMesg.style.display = 'block';
		}

		function verified() {
			/// user year must be greater then current year || a year more
			if (curDate[0] == userDates[0] || curDate[0] + 1 >= userDates[0]) {
				// user month must be equal or greater than current month
				if (curDate[1] <= userDates[1] || curDate[0] < userDates[0]) {
					// user day must be equal or greater than current day if in the same month, ...
					if (
						curDate[2] <= userDates[2] ||
						curDate[1] < userDates[1] ||
						curDate[0] < userDates[0]
					) {
						const userInputs = {
							cityName,
							year: userDates[0],
							month: userDates[1],
							day: userDates[2],
							curDate,
						};
						domObj.dateErrMesg.style.display = 'none';
						UserInputsCreateTrips(userInputs);
						domObj.search_city_input.value = '';
						domObj.trip_date_input.value = '';
						// return userInputs;
					} else {
						console.log('day false');
						updateUIData('invalid Day');
					}
				} else {
					console.log('false MO');
					updateUIData('invalid Month');
				}
			} else {
				console.log('false year');
				updateUIData('invalid Year');
			}
		}
		verified();
	}

	domObj.search_btn.addEventListener('click', userInputsVerification);
})();
