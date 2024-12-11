import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [account, setAccount] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get('http://localhost:5000/authen/status', { withCredentials: true });
        if (response.data && response.data.status === 'login') {
          navigate(-1);
        }
      } catch (error) {
        console.log('Error checking login status:', error);
      }
    };
    checkLoginStatus();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    try {
        const response = await axios.post(
            'http://localhost:5000/authen/login',
            { account, password },
            { withCredentials: true }
        );
        if (response.data && response.data.aid) {
            navigate(-1);
        }
    } catch (error) {
        if (error.response && error.response.data) {
            setErrorMessage(error.response.data.error || 'An error occurred. Please try again later.');
        } else {
            setErrorMessage('An error occurred. Please try again later.');
        }
    } finally {
        setLoading(false);
    }
};

  return (
    <div className="sign-up-overlay">
      <div className="frame-2">
        <div className="frame-3">
          <div className="logo" />
          <div className="frame-4">
            <h2 className="text-wrapper-4">Log in</h2>
            <div className="have-an-account">
              Don’t have an account?{" "}
              <span
                className="link"
                onClick={() => navigate("/authen/register")}
              >
                Sign up
              </span>
            </div>
          </div>
        </div>

        <form className="frame-6" onSubmit={handleSubmit}>
          <div className="text-field">
            <input
              className="label"
              type="text"
              placeholder="Your account"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              required
            />
            <div className="text-field-2" />
          </div>
          <div className="text-field">
            <div className="frame-8">
              <input
                className="label"
                type="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="text-field-2" />
            </div>
            <div className="text-wrapper-6">Forget your password?</div>
          </div>
          <button className="button" type="submit">
            Log in
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
