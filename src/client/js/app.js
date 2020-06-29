(function () {
	document.querySelector('#h1').addEventListener('click', function () {
		this.style.color = 'red';
		console.log(this);
	});

	const domObj = {
		search_btn: document.getElementById('btn-search'),
		search_city_input: document.getElementById('searchCity'),
		trip_date_input: document.getElementById('trip-date'),
	};

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
			/// user year must be greater then  current year
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
