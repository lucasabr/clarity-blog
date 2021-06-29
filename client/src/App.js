import { useSelector } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import AlreadyAuth from './components/AlreadyAuth';
import AccountForm from './components/AccountForm';
import NotLoggedIn from './components/NotLoggedIn';
function App() {
	const auth = useSelector(state => state.auth.status);
	return (
		<Switch>
			<Route exact path='/auth'>
				{!auth ? <AuthForm /> : <AlreadyAuth />}
			</Route>
			<Route exact path='/edit-profile'>
				{auth ? <AccountForm /> : <NotLoggedIn />}
			</Route>
		</Switch>
	);
}

export default App;
