import { useSelector } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import AlreadyAuth from './components/AlreadyAuth';
import AccountForm from './components/AccountForm';
import NotLoggedIn from './components/NotLoggedIn';
import Profiles from './components/Profiles';
import AccountFail from './components/AccountFail';
function App() {
	const auth = useSelector(state => state.auth.status);
	console.log(auth);
	return (
		<Switch>
			<Route exact path='/auth'>
				{!auth ? <AuthForm /> : <AlreadyAuth />}
			</Route>
			<Route exact path='/edit-profile'>
				{auth ? <AccountForm /> : <NotLoggedIn />}
			</Route>
			<Route exact path='/accounts/:username'>
				<Profiles />
			</Route>
			<Route exact path='/accountDoesntExist'>
				<AccountFail msg='This account does not exist' />
			</Route>
			<Route exact path='/accountPrivate'>
				<AccountFail msg='This account is private, please log in to view the account' />
			</Route>
		</Switch>
	);
}

export default App;
