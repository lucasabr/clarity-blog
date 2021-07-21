import React from 'react';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
const Profiles = () => {
	const auth = useSelector(state => state.auth.status);
	const { username } = useParams();
	let history = useHistory();
	const [user, setUser] = useState({});
	useEffect(() =>
		axios({
			method: 'get',
			withCredentials: true,
			url: `http://localhost:5000/accounts/${username}`,
		}).then(res => {
			if (!res.data.success) history.push('/accountDoesntExist');
			else {
				if (res.data.user.private && !auth) history.push('/accountPrivate');
				else {
					setUser(res.data.user);
				}
			}
		}),
	);
	return (
		<div>
			<h1>{user.name}</h1>
			<img src={user.avatar}></img>
			<h3>{user.description}</h3>
		</div>
	);
};

export default Profiles;
