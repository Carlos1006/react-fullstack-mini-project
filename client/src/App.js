import './App.css';
import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom"
import Welcome from "./components/login/Login";
import Profile from "./components/profile/Profile";
import EditProfile from "./components/editProfile/Profile";
import AllUsers from "./components/allusers/allUsers";
import Axios from "axios";
import {useEffect, useState} from "react";
import Splash from "./components/splash/Splash";
import Login from "./components/login/Login";


function App() {

  const [loginState,setLoginState] = useState(false);
  const [loaded,setLoaded] = useState(false);
  const [loginData,setLoginData] = useState(null);

  Axios.defaults.withCredentials = true;
  useEffect(()=> {
    Axios.get('http://localhost:3001/login').then((response)=>{
      console.log(response);
      setLoginState(response.data.ok);
      setLoaded(true);
      setLoginData(response.data.value);
    });
  },[]);

  if(!loaded) {
    return (<Splash/>);
  }else {
    return (
        <div className="App">
          <Router>
            <Routes>
              <Route path="/" element={loginState?<Profile/>:<Login/>}/>
              <Route path="/login" element={<Welcome/>}/>
              <Route path="/profile" element={<Profile data={loginData}/>}/>
              <Route path="/editProfile" element={<EditProfile/>}/>
              <Route path="/users" element={<AllUsers/>}/>
            </Routes>
          </Router>
        </div>
    );
  }

}

export default App;
