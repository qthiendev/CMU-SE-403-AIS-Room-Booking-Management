import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SearchRoom.css';

const SearchRoom = () => {
    const [rooms, setRooms] = useState([]);
    const [searchIndex, setSearchIndex] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchRooms = async (url) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(url, { withCredentials: true });
            if (response.data.success) {
                setRooms(response.data.rooms);
            } else {
                setRooms([]);
            }
        } catch (err) {
            setError('Failed to fetch rooms.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        if (!searchIndex) {
            fetchRooms('http://localhost:5000/room/get-all');
        } else {
            fetchRooms(`http://localhost:5000/room/search?index=${searchIndex}`);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleCardClick = (hotelAlias, roomId) => {
        navigate(`/${hotelAlias}/${roomId}`);
    };

    useEffect(() => {
        fetchRooms('http://localhost:5000/room/get-all'); // Load all rooms initially
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="search-container">
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search rooms..."
                    value={searchIndex}
                    onChange={(e) => setSearchIndex(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="search-input"
                />
                <button onClick={handleSearch} className="search-button">Search</button>
            </div>
            <div className="room-card-container">
                {rooms.map((room) => (
                    <div
                        key={room.room_id}
                        className="room-card"
                        onClick={() => handleCardClick(room.hotel_alias, room.room_id)}
                    >
                        <img
                            src={
                                room.hotel_name === "Hotel California"
                                    ? "https://i.pinimg.com/736x/e3/93/9a/e3939a042d1e3afc289b865e829e6038.jpg"
                                    : room.hotel_name === "The Grand Plaza"
                                    ? "https://i.pinimg.com/736x/b0/1d/24/b01d24bc43b8a0a059475f7ab213721f.jpg"
                                    : room.hotel_name === "Oceanview Resort"
                                    ? "https://i.pinimg.com/736x/71/86/13/7186137ffa71a3184b8b348429958073.jpg"
                                    : room.hotel_name === "Mountain Retreat"
                                    ? "https://i.pinimg.com/736x/71/86/13/7186137ffa71a3184b8b348429958073.jpg"
                                    : room.hotel_name === "Cityscape Suites"
                                    ? "https://i.pinimg.com/736x/c9/ee/8f/c9ee8ffcefe649de6df818e13fafe3ca.jpg"
                                    : "https://via.placeholder.com/150"
                            }
                            alt={room.name}
                            className="room-image"
                        />
                        <h3>{room.name}</h3>
                        <p><strong>Hotel:</strong> {room.hotel_name}</p>
                        <p><strong>Address:</strong> {room.hotel_address}</p>
                        <p><strong>Price:</strong> ${room.price}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchRoom;
