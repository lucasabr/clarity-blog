import { LOGGED_IN, LOGGED_OUT, UPDATED_ACCOUNT } from '../actions/types';

const initialState = {
	status: localStorage.getItem('token') ? true : false,
	msg: 'okay',
	user: localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')) : {},
};

export default function (state = initialState, action) {
	switch (action.type) {
		case LOGGED_IN:
			return {
				...state,
				status: action.payload.success,
				msg: action.payload.msg,
				user: action.payload.user,
			};
		case LOGGED_OUT:
			return {
				...state,
				status: false,
				msg: '',
				user: {},
			};
		case UPDATED_ACCOUNT:
			return {
				...state,
				status: action.payload.auth,
				msg: action.payload.msg,
				user: action.payload.user,
			};
		default:
			return state;
	}
}
