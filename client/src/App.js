import { useSelector } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import AlreadyAuth from './components/AlreadyAuth';
function App() {
	const auth = useSelector(state => state.auth.status);
	return (
		<Switch>
			<Route exact path='/auth'>
				{!auth ? <AuthForm /> : <AlreadyAuth />}
			</Route>
		</Switch>
	);
}

export default App;
