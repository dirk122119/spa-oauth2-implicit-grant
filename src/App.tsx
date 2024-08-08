import './App.css';
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import axios, {isCancel, AxiosError} from 'axios';
function Callback() {
  const location = useLocation();

  useEffect(() => {
    // 在重定向后处理URL中的Token
    const hash = location.hash;
    if (hash) {
      const token = new URLSearchParams(hash.replace('#', '')).get('access_token');
      window.history.replaceState({}, document.title, "/callback");
      if (token) {
        console.log('Access Token:', token);
        axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }).then(res => {
          console.log(res.data);
        })

        // 在这里你可以使用token进行API请求或存储它
      }
    }
  }, [location]);

  return (
    <div>
      <h2>Callback - Handling OAuth Response</h2>
    </div>
  );
}

const App = () => {
  const handleLogin = () => {
    const googleClientId = process.env.REACT_APP_googleClientId;
    const redirectUri = process.env.REACT_APP_redirectUri;
    const scope = process.env.REACT_APP_scope;
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=token&client_id=${googleClientId}&redirect_uri=${redirectUri}&scope=${scope}`;

    window.location.href = googleAuthUrl;
  };


  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div>
            <h2>Login with Google</h2>
            <button onClick={handleLogin}>Login with Google</button>
          </div>
        } />
        <Route path="/callback" element={<Callback />} />
      </Routes>
    </Router>
  );
};

export default App;
