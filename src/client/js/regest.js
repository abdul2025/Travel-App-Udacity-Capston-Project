const axios = require('axios');

function registerClient() {
	const btn_sign = document.getElementById('sing-up');
	const btn_log = document.getElementById('log-in');
	const singupEmail = document.getElementById('sing-email');
	const singupPassword = document.getElementById('sing-password');
	const loginEmail = document.getElementById('login-email');
	const loginPassword = document.getElementById('login-password');
	const singForm = document.querySelector('.sign-container');
	const logForm = document.querySelector('.log-container');
	const loginBar = document.querySelector('.loging');
	const btn_loging = document.querySelector('.btn-loging');
	const btn_singing = document.querySelector('.btn-sign');
	console.log(btn_loging);

	/// validate user Email address
	function emailValidation(email) {
		const emailRegex = new RegExp(/\S+@\S+\.\S+/);
		return emailRegex.test(email);
	}

	// uodate UI
	function updateUI(form, mess, emInput, pasInput, btn, time = 500) {
		btn.style.backgroundColor = '#3da4b5';
		emInput.value = '';
		pasInput.value = '';
		const success = document.createElement('h4');
		success.setAttribute('class', 'successMes');
		success.innerHTML = mess;
		success.style.color = 'green';
		form.insertAdjacentElement('beforeend', success);
		setTimeout(() => {
			success.innerHTML = ' ';
			setTimeout(() => {
				form.parentNode.style.display = 'none';
			}, 520);
		}, time);
	}

	// add user email + password to REST API
	btn_sign.addEventListener('click', async (e) => {
		e.preventDefault();
		const email = singupEmail.value;
		const password = singupPassword.value;
		if (emailValidation(email)) {
			if (password.length > 4) {
				try {
					const singUp = await axios.post('http://localhost:3000/singup', {
						email: email,
						password: password,
					});
					updateUI(
						singForm,
						'successful',
						singupEmail,
						singupPassword,
						btn_singing
					);
					console.log(singUp);
				} catch (err) {
					console.log(`${err.message} from singup post method`);
				}
			} else {
				console.log('password lenght');
			}
		} else {
			console.log('validation failed');
		}
	});

	// handling loging recive user email + pass
	btn_log.addEventListener('click', async (e) => {
		e.preventDefault();
		const email = loginEmail.value;
		const password = loginPassword.value;
		if (emailValidation(email)) {
			if (password.length > 4) {
				try {
					const login = await axios.get('http://localhost:3000/login');
					const result = login.data.users;
					function emailExists(user) {
						return user.email === email;
					}
					const existed = result.find(emailExists);
					if (existed !== undefined) {
						const html = document.createElement('h4');
						html.innerHTML = existed.email;
						html.style.padding = '4px 0';
						loginBar.insertAdjacentElement('afterbegin', html);
						updateUI(
							logForm,
							'Successful',
							loginEmail,
							loginPassword,
							btn_loging
						);
					} else {
						updateUI(
							logForm,
							'sing UP',
							loginEmail,
							loginPassword,
							btn_loging,
							2000
						);
					}
				} catch (err) {
					console.log(`${err.message} from singup post method`);
				}
			} else {
				console.log('password lenght');
			}
		} else {
			console.log('validation failed');
		}
	});
}

export { registerClient };
