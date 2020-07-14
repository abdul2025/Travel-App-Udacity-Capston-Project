import { emailValidation } from '../js/regest';
import apiKeys from '../../server/server';
import 'regenerator-runtime/runtime.js';

let res;
test('dummy test', () => {
	res = 2 * 3;
	expect(res).toBe(6);
});

// client test for emailValidation
test('emailValidation', () => {
	res = emailValidation('jj@gmail.com');
	expect(res).toBeTruthy();
	res = emailValidation(' ');
	expect(res).toBeFalsy();
	res = emailValidation('jjgmail.com');
	expect(res).toBeFalsy();
});

/// server test for api keys
test('verify api key', async () => {
	res = await apiKeys();
	expect(res).toBeEqual({
		API_USERNAME: 'abdul2020',
		API_KEY_weather: 'f1f6b2de665c4e3fb4aeed7502a046b9',
		API_KEY_pix: '17201323-ae9beedc0b9967c3d4793239a',
	});
});
