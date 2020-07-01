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
	};

	/// LOGINGs layout
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

	// current date
	function currentDate() {
		let date, day, month, year, months;
		date = new Date();
		day = date.getDate();
		month = date.getMonth();
		year = date.getFullYear();
		months = [
			'Jan',
			'Feb',
			'Mar',
			'Apr',
			'May',
			'Jun',
			'Jul',
			'Aug',
			'Sep',
			'Oct',
			'Nov',
			'Dec',
		];
		// let monthToString = () => {
		// 	return months[month];
		// };
		return [year, month + 1, day];
	}

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

		function verified() {
			/// user year must be greater then current year
			if (curDate[0] <= userDates[0]) {
				// user month must be equal or greater than current month
				if (curDate[1] <= userDates[1]) {
					// user day must be equal or greater than current day if in the same month, ...
					if (curDate[2] <= userDates[2] || curDate[1] < userDates[1]) {
						const userInputs = {
							cityName,
							year: userDates[0],
							month: userDates[1],
							day: userDates[2],
						};
						return userInputs;
					} else {
						console.log('false day');
						const dateErrMesg = document.createElement('div');
						dateErrMesg.setAttribute('class', 'dateErrMesg');
						dateErrMesg.innerHTML = 'Invalid date';
						domObj.search_bar.insertAdjacentElement('afterbegin', dateErrMesg);
					}
				} else {
					console.log('false MO');
				}
			} else {
				console.log('false year');
			}
		}
		const userInputs = verified();
		console.log(userInputs);
	}

	domObj.search_btn.addEventListener('click', userInputsVerification);
})();
