import React from "react";
import Navbar from "../Navbar/Navbar";
import SideText from "../SideText/SideText";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import "./Home.css";
function Home({ isLogin, setIslogin, token, setToken, setLoginMsg }) {
  const enter = async (loginData) => {
    try {
      const resp = await axios.post(
        "https://server-chat-app-trkp.onrender.com/api/user/login",
        loginData
      );
      const token1 = resp.headers.authorization;
      localStorage.setItem("token", token1);
      setToken(token1);
      setIslogin(true);
    } catch (error) {
      setLoginMsg(error);
      console.log(error);
    }
  };
  return (
    <div id="main">
      <Navbar className="navbar" />
      <div className="body">
        <SideText />
        <div className="Auth">
          <GoogleOAuthProvider clientId="573232329729-b7cl896krcqalql9nvqkfg0cl5ekpn2u.apps.googleusercontent.com">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                const decoded = jwtDecode(credentialResponse.credential);
                enter(decoded);
              }}
              onError={() => {
                console.log("Login Failed");
              }}
            />
            ;
          </GoogleOAuthProvider>
        </div>
      </div>
    </div>
  );
}

export default Home;
