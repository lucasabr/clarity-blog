import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loggedOut } from '../actions/authActions';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
const AlreadyAuth = () => {
	const user = useSelector(state => state.auth.user);
	const dispatch = useDispatch();
	let history = useHistory();
	const logout = () => {
		axios({
			method: 'delete',
			withCredentials: true,
			url: 'http://localhost:5000/logout',
		}).then(res => {
			localStorage.removeItem('logged');
			dispatch(loggedOut());
		});
	};
	return (
		<div>
			{!user.setupFinished
				? [
						<h3>
							Warning: You must setup your account before accessing the features of the site.
						</h3>,
						<button onClick={() => history.push('/edit-profile')}>Setup Account</button>,
				  ]
				: [
						<h3>Welcome to Clarity Blog {user.username}</h3>,
						<button onClick={() => history.push(`/user/${user.username}`)}>
							Visit your profile
						</button>,
				  ]}
			<button onClick={logout}>Logout</button>
		</div>
	);
};

export default AlreadyAuth;
