// Save, Delete, Show TRIPS
function saveTripToLocalStorage(trip, key) {
	localStorage.setItem(`trip-${key}`, JSON.stringify(trip));
}

function delateTripFromLocalStorage(id) {
	localStorage.removeItem(`trip-${id}`);
}

function displaySavedTripsLocalStorage() {
	const savedTripContainer = document.querySelector('.savedTrips_container');
	//// get keys from local storage
	let keys = Object.keys(localStorage);
	/// check for particular keyNames
	const filterdkeys = keys.filter((keyName) => {
		return keyName.includes('trip');
	});
	/// assign localStorage to an object
	const local = Object.entries(localStorage);
	/// looping over the object
	/// then loooping over the filterdkeys
	/// find matched keys
	/// display it in UI
	for (let i = 0; i < local.length; i++) {
		for (let j = 0; j < filterdkeys.length; j++) {
			if (local[i][0] === filterdkeys[j]) {
				let trip = JSON.parse(local[i][1]);
				savedTripContainer.insertAdjacentHTML('afterbegin', trip[0]);
			}
		}
	}
}

export {
	saveTripToLocalStorage,
	delateTripFromLocalStorage,
	displaySavedTripsLocalStorage,
};
