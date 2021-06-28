import { LOGGED_IN, LOGGED_OUT, UPDATED_ACCOUNT } from '../actions/types';
export const loggedIn = data => {
	return {
		type: LOGGED_IN,
		payload: {
			success: data.success,
			msg: data.msg,
			user: data.user,
		},
	};
};

export const loggedOut = () => dispatch => {};

export const updatedAccount = () => dispatch => {};
