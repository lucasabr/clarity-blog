import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AccountForm from './AccountForm';
import { loggedOut } from '../actions/authActions';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
const AlreadyAuth = () => {
	const setup = useSelector(state => state.auth.status);
	const dispatch = useDispatch();
	let history = useHistory();
	const logout = () => {
		axios({
			method: 'delete',
			withCredentials: true,
			url: 'http://localhost:5000/logout',
		}).then(res => {
			localStorage.removeItem('token');
			dispatch(loggedOut());
		});
	};
	return (
		<div>
			<AccountForm />
			<button onClick={logout}>Logout</button>
		</div>
	);
};

export default AlreadyAuth;
