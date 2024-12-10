import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/authen/status",
          { withCredentials: true }
        );

        if (response.data && response.data.status === "login") {
          setIsLoggedIn(true);
        } else if (response.data && response.data.status === "logout") {
          setIsLoggedIn(false);
        }
      } catch (error) {
        setErrorMessage("An error occurred. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  const handleLoginClick = () => {
    navigate("/authen/login");
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/authen/logout",
        {},
        { withCredentials: true }
      );
      setIsLoggedIn(false);
      navigate("/authen/login");
    } catch (error) {
      setErrorMessage("Failed to log out. Please try again later.");
    }
  };

  return (
    <div className="home-container">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {isLoggedIn ? (
            <>
            <div className="divAuthen">
                 <h2>Hello, User! You are logged in.</h2>
                 <button onClick={handleLogout}>Logout</button>
             </div>
              <section id="home-info" className="bg-dark">
                <div className="info-img"></div>
                <div className="info-content">
                  <h2>
                    <span className="text-primary">The History</span> of Our
                    Hotel
                  </h2>
                  <p>
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Ab, cum atque consequatur eveniet ea facere ad maiores
                    accusantium, dignissimos minima ipsam quasi vitae molestiae
                    impedit a, eaque repellendus vero dolorem et soluta
                    repudiandae! Accusantium et consequatur, quia consectetur
                    sapiente illum.
                  </p>
                  <a href="About.html" className="btn btn-light">
                    Read More
                  </a>
                </div>
              </section>
              <section id="features">
                <div className="box bg-light">
                  <i className="fas fa-hotel fa-3x"></i>
                  <h3>Great Location</h3>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Nisi, earum.
                  </p>
                </div>
                <div className="box bg-primary">
                  <i className="fas fa-utensils fa-3x"></i>
                  <h3>Free Meals</h3>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Nisi, earum.
                  </p>
                </div>
                <div className="box bg-light">
                  <i className="fas fa-dumbbell fa-3x"></i>
                  <h3>Fitness Room</h3>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Nisi, earum.
                  </p>
                </div>
              </section>
              <div className="clr"></div>
              <footer id="main-footer">
                Hotel AR &copy; 2020, All Rights Reserved
              </footer>
            </>
          ) : (
            <>
            <div className="divAuthen">
              <p>{errorMessage || "You are not logged in."}</p>
              <button onClick={handleLoginClick}>Login</button>
            </div>
              <div id="showcase">
                <div className="container">
                  <div className="showcase-content">
                    <h1>
                      <span className="text-primary">Enjoy</span>
                      Your Stay
                    </h1>
                    <p className="lead">
                      Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                      Repudiandae quas iure recusandae commodi cum veritatis.
                    </p>
                    <a className="btn" href="About.html">
                      About Our Hotel
                    </a>
                  </div>
                </div>
              </div>
              <section id="home-info" className="bg-dark">
                <div className="info-img"></div>
                <div className="info-content">
                  <h2>
                    <span className="text-primary">The History</span> of Our
                    Hotel
                  </h2>
                  <p>
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Ab, cum atque consequatur eveniet ea facere ad maiores
                    accusantium, dignissimos minima ipsam quasi vitae molestiae
                    impedit a, eaque repellendus vero dolorem et soluta
                    repudiandae! Accusantium et consequatur, quia consectetur
                    sapiente illum.
                  </p>
                  <a href="About.html" className="btn btn-light">
                    Read More
                  </a>
                </div>
              </section>
              <section id="features">
                <div className="box bg-light">
                  <i className="fas fa-hotel fa-3x"></i>
                  <h3>Great Location</h3>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Nisi, earum.
                  </p>
                </div>
                <div className="box bg-primary">
                  <i className="fas fa-utensils fa-3x"></i>
                  <h3>Free Meals</h3>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Nisi, earum.
                  </p>
                </div>
                <div className="box bg-light">
                  <i className="fas fa-dumbbell fa-3x"></i>
                  <h3>Fitness Room</h3>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Nisi, earum.
                  </p>
                </div>
              </section>
              <div className="clr"></div>
              <footer id="main-footer">
                Hotel AR &copy; 2020, All Rights Reserved
              </footer>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
