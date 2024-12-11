import { Outlet } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import './Layout.css';

function Layout() {
    const navigate = useNavigate();
    const [activeLink, setActiveLink] = useState('/');

    return (
        <div className="layout-container">
            <header>
              <nav id="navbar">
                <div className="container">
                  <h1 className="logo">
                    <a href="Index.html">Group 1</a>
                  </h1>
                  <ul>
                    <li>
                      <a
                        className={activeLink === '/' ? 'current' : ''}
                        onClick={() => {
                          setActiveLink('/');
                          navigate('/');
                        }}
                      >
                        Home
                      </a>
                    </li>
                    <li>
                      <a
                        className={activeLink === '/search/room' ? 'current' : ''}
                        onClick={() => {
                          setActiveLink('/search/room');
                          navigate('/search/room');
                        }}
                      >
                        Search
                      </a>
                    </li>
                    <li>
                      <a
                        className={activeLink === '/about' ? 'current' : ''}
                        onClick={() => {
                          setActiveLink('/about');
                          navigate('/about');
                        }}
                      >
                        About
                      </a>
                    </li>
                    <li>
                      <a
                        className={activeLink === '/contact' ? 'current' : ''}
                        onClick={() => {
                          setActiveLink('/contact');
                          navigate('/contact');
                        }}
                      >
                        Contact
                      </a>
                    </li>
                  </ul>
                </div>
              </nav>
            </header>

      <main>
        <Outlet />
        {/* All pages contain in ./pages will be render inside here */}
      </main>

      <footer>
        {/* Footer */}
        <i> @2024 - CMU-SE-403AIS - Room Booking Management System </i>
      </footer>
    </div>
  );
}

export default Layout;
