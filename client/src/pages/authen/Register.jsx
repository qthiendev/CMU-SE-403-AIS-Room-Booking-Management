import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
    const [account, setAccount] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:5000/authen/status',
                    { withCredentials: true }
                );

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
        setSuccessMessage('');

        try {
            const response = await axios.post(
                'http://localhost:5000/authen/register',
                { account, password, email, },
                { withCredentials: true }
            );

            if (response.status === 200) {
                setSuccessMessage('Registration successful!');
                navigate('/');
                navigate('/authen/login');
            }

        } catch (error) {
            if (error.response && error.response.data) {
                if (error.response.status === 400) {
                    setErrorMessage('Bad Request: Invalid data submitted.');
                } else if (error.response.status === 403) {
                    setErrorMessage('You already rgisted with this account/email.');
                }

            } else {
                setErrorMessage('An error occurred. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit} className="register-form">
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
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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

                {successMessage && <p className="success-message">{successMessage}</p>}
                {errorMessage && <p className="error-message">{errorMessage}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
        </div>
    );
};

export default Register;
