import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
const AccountForm = () => {
	const user = useSelector(state => state.auth.user);
	const [username, setUsername] = useState('');
	const [description, setDesc] = useState('');
	const [priv, setPriv] = useState(false);
	return (
		<div>
			<form>
				<h1>Edit Profile</h1>
				<p>Email: {user.email}</p>
				<label for='username'>Username: </label>
				<input
					type='text'
					id='username'
					name='username'
					onChange={e => setUsername(e.target.value)}
					maxlength='16'
					minLength='4'
					value={user.username ? user.username : ''}
					required
				/>
				<hr></hr>
				<label for='description'>Description</label>
				<input
					type='text'
					id='description'
					name='description'
					onChange={e => setDesc(e.target.value)}
					value={user.descrition ? user.description : ''}
				/>
				<label for='private'>Should your account be private?</label>
				<input
					type='checkbox'
					id='private'
					name='private'
					onChange={e => setPriv(e.target.value)}
					required
				/>
				<button>Save</button>
			</form>
		</div>
	);
};

export default AccountForm;
