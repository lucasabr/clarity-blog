import React from 'react';
import { useHistory } from 'react-router-dom';
const NotLoggedIn = () => {
	const history = useHistory();
	return (
		<div>
			<h1>Please Log In or Register to access these features</h1>
			<button onClick={() => history.push('/auth')}>Login Page</button>
		</div>
	);
};

export default NotLoggedIn;
