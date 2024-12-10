import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/authen/status",
          { withCredentials: true }
        );

        if (response.data && response.data.status === "login") {
          navigate(-1);
        }
      } catch (error) {
        console.log("Error checking login status:", error);
      }
    };

    checkLoginStatus();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await axios.post(
        "http://localhost:5000/authen/register",
        { account, password, email },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setSuccessMessage("Registration successful!");
        navigate("/");
        navigate("/authen/login");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response.status === 400) {
          setErrorMessage("Bad Request: Invalid data submitted.");
        } else if (error.response.status === 403) {
          setErrorMessage("You already registered with this account/email.");
        }
      } else {
        setErrorMessage("An error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Create Your Account</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <input
          type="text"
          placeholder="Username"
          value={account}
          onChange={(e) => setAccount(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="button">
          Sign Up
        </button>
      </form>
      <div className="footer">
        Already have an account?{" "}
        <a onClick={() => navigate("/authen/login")}>Log in</a>
      </div>
    </div>
  );
};

export default Register;
