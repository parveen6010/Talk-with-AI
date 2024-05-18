import "./App.css";
import Home from "./components/HomePage/Home";
import Dashboard from "./components/Dashboard/Dashboard";

import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
function App() {
  const [isLogin, setIslogin] = useState(false);
  const [loginMsg, setLoginMsg] = useState(null);
  const [token, setToken] = useState(null);

  const enter = async (loginData) => {
    try {
      const res = await axios.post(
        "https://server-chat-app-trkp.onrender.com/api/user/login",
        loginData
      );
      const token1 = res.headers.authorization;
      localStorage.setItem("token", token1);
      setToken(token1);
      setIslogin(true);
    } catch (error) {
      setLoginMsg(error);
      console.log(error);
    }
  };

  return (
    <div className="App">
      {isLogin ? (
        <Dashboard token={token} />
      ) : (
        <Home
          isLogin={isLogin}
          setIslogin={setIslogin}
          token={token}
          setToken={setToken}
          setLoginMsg={setLoginMsg}
        />
      )}
    </div>
  );
}

export default App;
