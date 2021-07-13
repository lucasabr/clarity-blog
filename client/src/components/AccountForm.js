import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { useState } from 'react';
import { updatedAccount } from '../actions/authActions';
const AccountForm = () => {
	const user = useSelector(state => state.auth.user);
	const [username, setUsername] = useState('');
	const [description, setDesc] = useState('');
	const [priv, setPriv] = useState(false);
	const dispatch = useDispatch();
	const editProfile = () => {
		username !== '' &&
			axios({
				method: 'post',
				data: {
					email: user.email,
					username: username,
					description: description,
					private: priv,
				},
				withCredentials: true,
				url: 'http://localhost:5000/updateAccount',
			}).then(res => {
				if (res.data.success) {
					localStorage.setItem('token', JSON.stringify(res.data.user));
					console.log(res.data);
					dispatch(updatedAccount(res.data));
				}
			});
	};

	return (
		<div>
			<form onSubmit={e => e.preventDefault()}>
				<h1>Edit Profile</h1>
				<p>Email: {user.email}</p>
				<label for='username'>Username: </label>
				<input
					type='text'
					id='username'
					name='username'
					onChange={e => setUsername(e.target.value)}
					maxLength='16'
					minLength='4'
					placeholder={user.name ? user.name : ''}
					required
				/>
				<hr></hr>
				<label for='description'>Description</label>
				<input
					type='text'
					id='description'
					maxLength='200'
					name='description'
					onChange={e => setDesc(e.target.value)}
					placeholder={user.description ? user.description : ''}
				/>
				<label for='private'>Should your account be private?</label>
				<input
					type='checkbox'
					id='private'
					name='private'
					onChange={e => {
						setPriv(e.target.checked);
					}}
					required
				/>
				<button onClick={() => editProfile()}>Save</button>
			</form>
		</div>
	);
};

export default AccountForm;
