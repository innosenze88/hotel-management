
import React, { useState } from 'react';
import { Room, Booking } from '../types';
import BookingForm from './BookingForm';
import BookingConfirmation from './BookingConfirmation';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookingSuccess: () => void;
  room: Room | null;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, onBookingSuccess, room }) => {
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  const handleSuccess = (booking: Booking) => {
    setConfirmedBooking(booking);
  };

  const handleCloseAndReset = () => {
    setConfirmedBooking(null);
    onClose();
    // This final call ensures the parent grid is refreshed after closing the confirmation.
    onBookingSuccess();
  };
  
  if (!isOpen || !room) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl flex flex-col p-6 text-white">
        <div className="flex justify-between items-center border-b border-slate-700 pb-4 mb-4">
          <h2 className="text-2xl font-bold">
            {confirmedBooking ? 'Booking Confirmation' : `Book Room ${room.roomNumber}`}
          </h2>
          <button onClick={handleCloseAndReset} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
        </div>
        
        <div className="overflow-y-auto">
          {confirmedBooking ? (
            <BookingConfirmation booking={confirmedBooking} onClose={handleCloseAndReset} />
          ) : (
            <BookingForm 
              room={room} 
              onBookingSuccess={handleSuccess} 
              onCancel={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
