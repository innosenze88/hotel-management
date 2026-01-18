
import React from 'react';
import { Booking } from '../types_bookings';

interface BookingConfirmationProps {
  booking: Booking;
  onClose: () => void;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({ booking, onClose }) => {
  return (
    <div className="bg-gray-700/50 p-6 rounded-xl shadow-lg text-white text-center">
      <h3 className="text-2xl font-bold text-green-400 mb-4">Booking Confirmed!</h3>
      <div className="space-y-2 text-gray-300 text-left">
        <p><span className="font-semibold text-gray-100 w-28 inline-block">Confirmation ID:</span> {booking.id}</p>
        <p><span className="font-semibold text-gray-100 w-28 inline-block">Room ID:</span> {booking.roomId}</p>
        <p><span className="font-semibold text-gray-100 w-28 inline-block">Check-in:</span> {booking.startDate}</p>
        <p><span className="font-semibold text-gray-100 w-28 inline-block">Check-out:</span> {booking.endDate}</p>
        <p className="text-xl pt-2"><span className="font-semibold text-gray-100 w-28 inline-block">Total:</span> ฿{booking.totalAmount.toLocaleString()}</p>
      </div>
      <button 
        onClick={onClose} 
        className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
        Make Another Booking
      </button>
    </div>
  );
};

export default BookingConfirmation;
