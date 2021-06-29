import { useState } from 'react';
import axios from 'axios';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loggedIn } from '../actions/authActions';
import { useHistory } from 'react-router-dom';
const AuthForm = () => {
	const [regUser, setRegUser] = useState('');
	const [regPass, setRegPass] = useState('');
	const [loginUser, setLoginUser] = useState('');
	const [loginPass, setLoginPass] = useState('');
	const [authState, setAuthState] = useState(1);
	const [regMsg, setRegMsg] = useState('');
	const loginMsg = useSelector(state => state.auth.msg);
	const dispatch = useDispatch();
	//---------------------------End of State---------------------------------------------------
	let history = useHistory();
	const login = () =>
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
		}).then(res => {
			if (res.data.success) {
				localStorage.setItem('token', JSON.stringify(res.data.user));
			}
			dispatch(loggedIn(res.data));
		});

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
			}).then(res => {
				res.data.success
					? setRegMsg('Please confirm your account via email before logging in.')
					: setRegMsg(res.data.msg);
			});
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
				<h3>{authState === 1 ? regMsg : loginMsg}</h3>
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
};

export default AuthForm;
