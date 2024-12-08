import { Outlet } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Layout.css';

function Layout() {
    const navigate = useNavigate();

    return (
        <div className="layout-container">
            <header>
                {/* Header here, implement navbar, sidebar, etc. */}
                <ul className='nav_bar'>
                    <li onClick={() => { navigate('/') }} >Home</li>
                    <li onClick={() => { navigate('/search/room') }} >Search</li>
                </ul>
            </header>

            <main>
                <Outlet />
                {/* All pages contain in ./pages will be render inside here */}
            </main>

            <footer>
                {/* Footer */}
            </footer>
        </div>
    );
}

export default Layout;
