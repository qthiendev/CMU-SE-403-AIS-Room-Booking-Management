const { tryBooking, tryCheckBooking } = require('./booking.model');

const booking = async (req, res) => {
    try {
        const { room_id } = req.params;
        let bookingData = req.body;

        const transformedData = {
            detail: bookingData.detail,
            customer_email: bookingData.customerEmail,
            customer_phone: bookingData.customerPhone,
            check_in_date: bookingData.checkInDate,
            check_out_date: bookingData.checkOutDate,
            pay_amount: bookingData.payAmount,
            full_payment: bookingData.payAmount === bookingData.price ? 1 : 0,
            room_id: room_id
        };

        console.log({ room_id, ...transformedData });

        const result = await tryBooking(transformedData);

        return res.status(201).json({
            success: true,
            message: 'Booking successful.',
            data: result
        });
    } catch (err) {
        console.error('Booking error:', err);

        return res.status(500).json({
            success: false,
            message: err.message || 'Booking failed. Please try again later.'
        });
    }
};

const checkBooking = async (req, res) => {
    try {
        const { transaction_id } = req.params;

        const booking = await tryCheckBooking(transaction_id);

        if (!booking) {
            return res.status(404).json({
                success: false,
            });
        }

        return res.status(200).json({
            success: true,
            ...booking
        });
    } catch (err) {
        console.error('Check booking error:', err);

        return res.status(404).json({
            success: false,
            message: err.message || 'Booking not found.'
        });
    }
};

module.exports = { booking, checkBooking };
