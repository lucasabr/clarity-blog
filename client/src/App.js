import { useState } from 'react';
import axios from 'axios';

function App() {
	const [regUser, setRegUser] = useState('');
	const [regPass, setRegPass] = useState('');
	const [loginUser, setLoginUser] = useState('');
	const [loginPass, setLoginPass] = useState('');
	const [authState, setAuthState] = useState(1);

	//---------------------------End of State---------------------------------------------------

	const login = () => {
		loginUser !== '' &&
			loginPass !== '' &&
			axios({
				method: 'post',
				data: {
					email: loginUser,
					password: loginPass,
				},
				withCredentials: true,
				url: 'http://localhost:5000/login',
			})
				.then(res => console.log(res))
				.catch(err => console.log(err));
	};

	const register = () => {
		regUser !== '' &&
			regPass !== '' &&
			axios({
				method: 'post',
				data: {
					email: regUser,
					password: regPass,
				},
				withCredentials: true,
				url: 'http://localhost:5000/register',
			}).then(res => console.log(res));
	};

	//-------------------------------------End of Requests---------------------------------------
	const clearReg = () => {
		setRegUser('');
		setRegPass('');
	};

	const clearLogin = () => {
		setLoginUser('');
		setLoginPass('');
	};

	const toggleAuthState = () => {
		Array.from(document.querySelectorAll('input')).forEach(input => (input.value = ''));
		authState === 1 ? clearReg() : clearLogin();
		setAuthState(authState * -1);
	};

	//------------------------------------------End of Toggle Code------------------------------------------------
	return (
		<div>
			<form onSubmit={e => e.preventDefault()}>
				<h1>{authState === 1 ? 'Register' : 'Login'}</h1>
				<label for='email'>Email</label>
				<input
					type='email'
					id='email'
					name='email'
					onChange={e =>
						authState === 1 ? setRegUser(e.target.value) : setLoginUser(e.target.value)
					}
					required
				/>
				<label for='password'>Password</label>
				<input
					type='password'
					id='password'
					name='password'
					onChange={e =>
						authState === 1 ? setRegPass(e.target.value) : setLoginPass(e.target.value)
					}
					required
				/>
				<button onClick={() => (authState === 1 ? register() : login())}>Submit</button>
			</form>
			<button onClick={() => toggleAuthState()}>
				Click for {authState === 1 ? 'Login' : 'Register'}
			</button>
		</div>
	);
}

export default App;
