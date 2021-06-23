import { useState } from "react";
import axios from 'axios';

function App() {
  const [regUser, setRegUser] = useState("")
  const [regPass, setRegPass] = useState("")
  const [loginUser, setLoginUser] = useState("")
  const [loginPass, setLoginPass] = useState("")
  const [authState, setAuthState] = useState(1)


  const login = () => {

  }

  const register = () => {
    (regUser!="") &&
    (regPass!="") &&
    axios({
      method: "post",
      data: {
        email: regUser,
        password: regPass
      },
      withCredentials: true,
      url: "http://localhost:5000/register"
    }).then((res) => console.log(res))
  }

  return (
    <div >
      <form>
        <h1>{(authState===1) ? "Register" : "Login"}</h1>
        <label for="email">Email</label>
        <input type="email" id="email" name="email" 
        onChange={e => (authState===1) ? setRegUser(e.target.value) : setLoginUser(e.target.value)} 
        required/>
        <label for="password">Password</label>
        <input type="password" id="password" name="password" 
        onChange={e => (authState===1) ? setRegPass(e.target.value) : setLoginPass(e.target.value)}
        required />
        <button onClick={() => (authState===1) ? register() : login()}>Submit</button>
      </form>
      <button onClick={() => setAuthState(authState * -1)}>Click for {(authState===1) ? "Login" : "Register"}</button>

    
    </div>
  );
}

export default App;
