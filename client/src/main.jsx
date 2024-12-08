import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import './main.css';

import Layout from './Layout.jsx';

// Import page here
import Home from './pages/Home.jsx';
import Login from './pages/authen/Login.jsx';

const Router = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>

                {/* Import page with route here */}
                <Route path="/" element={<Home />} /> 
                <Route path="/home" element={<Home />} /> 

                <Route path="/authen/login" element={<Login />} /> 
            </Route>
        </Routes>
    );
};

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <Router />
    </BrowserRouter>
);
