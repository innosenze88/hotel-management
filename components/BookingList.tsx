
import React from 'react';
import { Booking, BookingStatus } from '../types';

interface BookingListProps {
  bookings: Booking[];
}

const statusColors: Record<BookingStatus, string> = {
  'Confirmed': 'bg-blue-600 text-white',
  'Checked-in': 'bg-green-600 text-white',
  'Checked-out': 'bg-gray-500 text-white',
  'Cancelled': 'bg-red-600 text-white',
};

const BookingList: React.FC<BookingListProps> = ({ bookings }) => {
  if (bookings.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        <p>No current bookings found.</p>
      </div>
    );
  }

  return (
    <div className="max-h-80 overflow-y-auto pr-2 -mr-2">
      <div className="w-full text-sm text-left text-gray-400">
        {bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((booking) => (
            <div key={booking.id} className="bg-gray-700/50 p-3 rounded-lg mb-2">
                <div className="flex justify-between items-center">
                    <p className="font-semibold text-white">
                        Room {booking.roomNumber} - <span className="font-normal">{booking.guestName}</span>
                    </p>
                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${statusColors[booking.status]}`}>
                        {booking.status}
                    </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                    {booking.startDate} to {booking.endDate}
                </p>
            </div>
        ))}
      </div>
    </div>
  );
};

export default BookingList;
