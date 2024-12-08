import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const RoomInfo = () => {
    const { hotel_alias, room_id } = useParams();
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRoom = async () => {
            setLoading(true);
            setError(null);

            if (room_id === null || room_id === undefined || !hotel_alias) return;

            try {
                const response = await axios.get(
                    `http://localhost:5000/room/get/${hotel_alias}/${room_id}`,
                    { withCredentials: true }
                );

                if (response.status === 200) {
                    setRoom(response.data);
                } else {
                    setError('Room not found');
                }
            } catch (err) {
                setError(err.message || 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchRoom();
    }, [room_id, hotel_alias, navigate]);

    const handleBookNow = () => {
        navigate(`/booking/create/${hotel_alias}/${room_id}`);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!room) {
        return <p>Room not found</p>;
    }

    return (
        <div className="room-info-container">
            <h2>{room.name}</h2>
            <p><strong>Description:</strong> {room.description}</p>
            <p><strong>Price:</strong> ${room.price}</p>
            <p><strong>Availability:</strong> {room.available_flag ? 'Available' : 'Not Available'}</p>

            <h3>Hotel Information:</h3>
            <p><strong>Hotel Name:</strong> {room.hotel_name}</p>
            <p><strong>Hotel Alias:</strong> {room.hotel_alias}</p>
            <p><strong>Description:</strong> {room.hotel_description}</p>
            <p><strong>Address:</strong> {room.hotel_address}</p>
            <p><strong>Phone:</strong> {room.hotel_phone}</p>
            <p><strong>Email:</strong> <a href={`mailto:${room.hotel_email}`}>{room.hotel_email}</a></p>

            {/* Book Now Button */}
            <button className="book-now-button" onClick={handleBookNow}>
                Book Now
            </button>
        </div>
    );
};

export default RoomInfo;
