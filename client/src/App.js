import { useSelector } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import AuthForm from './components/AuthForm';
function App() {
	const auth = useSelector(state => state.auth.status);
	return (
		<Switch>
			<Route path='/auth'>{!auth ? <AuthForm /> : <h1>Already logged in.</h1>}</Route>
		</Switch>
	);
}

export default App;
