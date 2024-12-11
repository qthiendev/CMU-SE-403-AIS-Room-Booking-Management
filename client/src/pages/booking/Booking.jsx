import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './Booking.css';

const Booking = () => {
    const { hotel_alias, room_id } = useParams();
    const [room, setRoom] = useState(null);
    const [bookingData, setBookingData] = useState({
        detail: '',
        customerEmail: '',
        customerPhone: '',
        checkInDate: '',
        checkOutDate: '',
        payAmount: '',
        fullPayment: 0,
        room_id: room_id
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formError, setFormError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRoom = async () => {
            setLoading(true);
            setError(null);
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
    }, [hotel_alias, room_id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBookingData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleBooking = async () => {
        const { detail, customerPhone, checkInDate, checkOutDate, payAmount } = bookingData;

        // Basic form validation
        if (!customerPhone || !checkInDate || !checkOutDate || !payAmount) {
            setFormError('Phone, Check-in Date, Check-out Date, and Pay Amount are required.');
            return;
        }

        if (new Date(checkInDate) > new Date(checkOutDate)) {
            setFormError('Check-in date must be before or equal to check-out date.');
            return;
        }

        if (payAmount <= 100 || payAmount > room?.price) {
            setFormError(`Pay amount must be between 100 and ${room?.price}`);
            return;
        }

        const updatedBookingData = {
            ...bookingData,
            detail: detail || `Booking for room ${room?.name} of ${room?.hotel_name}`,
            fullPayment: payAmount === room?.price ? 1 : 0
        };

        setLoading(true);
        setError(null);
        setFormError('');
        try {
            const response = await axios.post(
                `http://localhost:5000/booking/create/${room_id}`,
                updatedBookingData,
                { withCredentials: true }
            );
            if (response.data.success) {
                navigate(`/booking/check/${response.data.data.transaction_id}`);
            } else {
                setError('Booking failed. Please try again.');
            }
        } catch (err) {
            setError('Booking failed. Please try again.');
        } finally {
            setLoading(false);
        }
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
        <div className="booking-container">
            <h2 className="booking-title">Book Room: {room.name}</h2>

            {/* Room Information */}
            <div className="room-info">
                <p><strong>Description:</strong> {room.description}</p>
                <p><strong>Hotel Name:</strong> {room.hotel_name}</p>
                <p><strong>Address:</strong> {room.hotel_address}</p>
                <p><strong>Price:</strong> ${room.price}</p>
                <p><strong>Availability:</strong> {room.available_flag ? 'Available' : 'Not Available'}</p>
            </div>

            {/* Booking Form */}
            <div className="booking-form">
                <h3 className="form-title">Fill out the booking form</h3>
                {formError && <p className="form-error">{formError}</p>}
                <div className="input-container">
                    <label className="input-label">Detail</label>
                    <input
                        type="text"
                        name="detail"
                        placeholder="Booking details (Optional)"
                        value={bookingData.detail}
                        onChange={handleChange}
                        className="input-field"
                    />
                </div>
                <div className="input-container">
                    <label className="input-label">Email</label>
                    <input
                        type="email"
                        name="customerEmail"
                        placeholder="Customer Email (Optional)"
                        value={bookingData.customerEmail}
                        onChange={handleChange}
                        className="input-field"
                    />
                </div>
                <div className="input-container">
                    <label className="input-label">Phone <span className="required">*</span></label>
                    <input
                        type="text"
                        name="customerPhone"
                        placeholder="Customer Phone"
                        value={bookingData.customerPhone}
                        onChange={handleChange}
                        className="input-field"
                    />
                </div>
                <div className="input-container">
                    <label className="input-label">Check-in Date <span className="required">*</span></label>
                    <input
                        type="date"
                        name="checkInDate"
                        value={bookingData.checkInDate}
                        onChange={handleChange}
                        className="input-field"
                    />
                </div>
                <div className="input-container">
                    <label className="input-label">Check-out Date <span className="required">*</span></label>
                    <input
                        type="date"
                        name="checkOutDate"
                        value={bookingData.checkOutDate}
                        onChange={handleChange}
                        className="input-field"
                    />
                </div>
                <div className="input-container">
                    <label className="input-label">Pay Amount <span className="required">*</span></label>
                    <input
                        type="number"
                        name="payAmount"
                        placeholder="Amount to pay"
                        value={bookingData.payAmount}
                        onChange={handleChange}
                        className="input-field"
                    />
                </div>
                <button
                    onClick={handleBooking}
                    className="booking-button"
                    disabled={loading}
                >
                    {loading ? 'Booking...' : 'Book Now'}
                </button>
            </div>
        </div>
    );
};

export default Booking;
