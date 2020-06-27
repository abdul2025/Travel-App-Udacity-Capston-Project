import { geonamesApi } from './apiData';

(function () {
	// geonamesApi();
	document.querySelector('#h1').addEventListener('click', function () {
		this.style.color = 'red';
		console.log(this);
	});
	console.log('APP is running');
})();
