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
