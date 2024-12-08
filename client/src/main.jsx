import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import './main.css';

import Layout from './Layout.jsx';

// Import page here
import Home from './pages/Home.jsx';
import Login from './pages/authen/Login.jsx';
import Register from './pages/authen/Register.jsx';
import RoomInfo from './pages/room/RoomInfo.jsx';
import SearchRoom from './pages/room/SearchRoom.jsx';
import Booking from './pages/booking/Booking.jsx';
import CheckBooking from './pages/booking/CheckBooking.jsx';

const Router = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>

                {/* Import page with route here */}
                <Route path="/" element={<Home />} /> 
                <Route path="/home" element={<Home />} /> 

                <Route path="/authen/login" element={<Login />} /> 
                <Route path="/authen/register" element={<Register />} /> 

                <Route path=":hotel_alias/:room_id" element={<RoomInfo />} /> 
                <Route path="search/room" element={<SearchRoom />} />

                <Route path="booking/create/:hotel_alias/:room_id" element={<Booking />} />
                <Route path="booking/check/:transaction_id" element={<CheckBooking />} />
            </Route>
        </Routes>
    );
};

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <Router />
    </BrowserRouter>
);
