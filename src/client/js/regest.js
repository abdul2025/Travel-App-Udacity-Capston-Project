const axios = require('axios');

function registerClient() {
	const btn_sign = document.getElementById('sing-up');
	const btn_log = document.getElementById('log-in');
	const singupEmail = document.getElementById('sing-email');
	const singupPassword = document.getElementById('sing-password');
	const loginEmail = document.getElementById('login-email');
	const loginPassword = document.getElementById('login-password');
	const form = document.querySelector('.sign-container');

	/// validate user Email address
	function emailValidation(email) {
		const emailRegex = new RegExp(/\S+@\S+\.\S+/);
		return emailRegex.test(email);
	}

	// uodate UI
	function updateUI() {
		singupEmail.value = '';
		singupPassword.value = '';
		const success = document.createElement('h4');
		success.setAttribute('class', 'successMes');
		success.innerHTML = 'Successful';
		success.style.color = 'green';
		form.insertAdjacentElement('beforeend', success);
		setTimeout(() => {
			success.innerHTML = ' ';
		}, 2000);
	}

	// add user email + password to REST API
	btn_sign.addEventListener('click', async (e) => {
		e.preventDefault();
		const email = singupEmail.value;
		const password = singupPassword.value;
		if (emailValidation(email)) {
			if (password.length > 4) {
				const singUp = await axios.post('http://localhost:3000/singup', {
					email: email,
					password: password,
				});
				updateUI();
				console.log(singUp);
			} else {
				console.log('password lenght');
			}
		} else {
			console.log('validation failed');
		}
	});
}

export { registerClient };
