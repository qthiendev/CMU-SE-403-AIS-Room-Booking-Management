import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './CheckBooking.css';  // Import the CSS file

const CheckBooking = () => {
    const { transaction_id } = useParams();
    const [bookingDetails, setBookingDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookingDetails = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axios.get(
                    `http://localhost:5000/booking/check/${transaction_id}`,
                    { withCredentials: true } // Include credentials
                );
                if (response.data.success) {
                    setBookingDetails(response.data);
                } else {
                    setError('Booking not found');
                }
            } catch (err) {
                setError(err.message || 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        if (transaction_id) {
            fetchBookingDetails();
        }
    }, [transaction_id]);

    if (loading) {
        return <p className="loading">Loading...</p>;
    }

    if (error) {
        return <p className="error">{error}</p>;
    }

    if (!bookingDetails) {
        return <p className="error">Booking not found</p>;
    }

    const {
        detail,
        customer_email,
        customer_phone,
        check_in_date,
        check_out_date,
        pay_amount,
        full_payment,
        room_name,
        room_price,
        hotel_name,
        hotel_address,
        hotel_phone,
        hotel_email,
    } = bookingDetails;

    return (
        <div className="booking-details">
            <h2 className="title">Booking Details</h2>
            <p><strong>Transaction ID:</strong> {transaction_id}</p>
            <p><strong>Booking Detail:</strong> {detail || `Booking for room ${room_name} of ${hotel_name}`}</p>
            <p><strong>Customer Email:</strong> {customer_email || 'Not Provided'}</p>
            <p><strong>Customer Phone:</strong> {customer_phone}</p>
            <p><strong>Check-in Date:</strong> {check_in_date}</p>
            <p><strong>Check-out Date:</strong> {check_out_date}</p>
            <p><strong>Payment Amount:</strong> ${pay_amount} / ${room_price} {full_payment ? '' : '(Please complete payment)'}</p>
            <div className="hotel-info">
                <p><strong>Hotel Address:</strong> {hotel_address}</p>
                <p><strong>Hotel Phone:</strong> {hotel_phone}</p>
                <p><strong>Hotel Email:</strong> {hotel_email}</p>
            </div>
        </div>
    );
};

export default CheckBooking;
