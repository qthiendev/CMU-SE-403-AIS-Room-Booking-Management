import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login submitted with", { email, password });
    // Thêm logic xử lý đăng nhập ở đây
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
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
