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
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit} className="login-form">
                <div>
                    <label htmlFor="account">Account:</label>
                    <input
                        type="text"
                        id="account"
                        value={account}
                        onChange={(e) => setAccount(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {errorMessage && <p className="error-message">{errorMessage}</p>}

                {loading ? (
                    <div className="spinner">Loading...</div>  // You can replace this with a spinner component if you have one
                ) : (
                    <button type="submit">
                        Login
                    </button>
                )}
            </form>
        </div>
    );
};

export default Login;
