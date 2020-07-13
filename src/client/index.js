import {} from './js/app';
import { getKeys } from './js/createTrips';
import { registerClient } from './js/regest';
import { displaySavedTripsLocalStorage } from './js/toLocalStorage';
import {} from './js/toDoList';

//
registerClient();
// get keys for API Requests
getKeys();

displaySavedTripsLocalStorage();

// styles
import './style/assets.scss';
import './style/header.scss';
import './style/trip_contiainer.scss';
import './style/savedTrips&toDoListApp.scss';

/// font Awesome icons
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';

console.log('CHANGE!!');
