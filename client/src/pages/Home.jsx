import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await axios.get('http://localhost:5000/authen/status', { withCredentials: true });

                if (response.data && response.data.status === 'login') {
                    setIsLoggedIn(true);
                } else if (response.data && response.data.status === 'logout') {
                    setIsLoggedIn(false);
                }
            } catch (error) {
                setErrorMessage('An error occurred. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        checkLoginStatus();
    }, []);

    const handleLoginClick = () => {
        navigate('/authen/login');
    };

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:5000/authen/logout', {}, { withCredentials: true });
            setIsLoggedIn(false);
            navigate('/authen/login');
        } catch (error) {
            setErrorMessage('Failed to log out. Please try again later.');
        }
    };

    return (
        <div className="home-container">
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    {isLoggedIn ? (
                        <div>
                            <h2>Hello, User! You are logged in.</h2>
                            <button onClick={handleLogout}>Logout</button>
                        </div>
                    ) : (
                        <div>
                            <p>{errorMessage || 'You are not logged in.'}</p>
                            <button onClick={handleLoginClick}>Login</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Home;
