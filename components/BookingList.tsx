
import React from 'react';
import { Booking, BookingStatus } from '../types';

interface BookingListProps {
  bookings: Booking[];
  onCancelBooking: (bookingId: string) => void;
}

const statusColors: Record<BookingStatus, string> = {
  'Confirmed': 'bg-blue-600 text-white',
  'Checked-in': 'bg-green-600 text-white',
  'Checked-out': 'bg-gray-500 text-white',
  'Cancelled': 'bg-red-600 text-white',
};

const BookingList: React.FC<BookingListProps> = ({ bookings, onCancelBooking }) => {
  const handleCancelClick = (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      onCancelBooking(bookingId);
    }
  };

  if (bookings.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        <p>No current bookings found.</p>
      </div>
    );
  }

  return (
    <div className="max-h-96 overflow-y-auto">
      <table className="w-full text-sm text-left text-gray-400">
        <thead className="text-xs text-gray-300 uppercase bg-gray-700 sticky top-0">
          <tr>
            <th scope="col" className="px-4 py-3">Room</th>
            <th scope="col" className="px-4 py-3">Guest</th>
            <th scope="col" className="px-4 py-3 hidden sm:table-cell">Check-in</th>
            <th scope="col" className="px-4 py-3 hidden md:table-cell">Check-out</th>
            <th scope="col" className="px-4 py-3">Status</th>
            <th scope="col" className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((booking) => (
            <tr key={booking.id} className="border-b border-gray-700 hover:bg-gray-700/50">
              <td className="px-4 py-3 font-medium text-white">{booking.roomNumber}</td>
              <td className="px-4 py-3">{booking.guestName}</td>
              <td className="px-4 py-3 hidden sm:table-cell">{booking.startDate}</td>
              <td className="px-4 py-3 hidden md:table-cell">{booking.endDate}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 text-xs font-bold rounded-full ${statusColors[booking.status]}`}>
                  {booking.status}
                </span>
              </td>
              <td className="px-4 py-3">
                {booking.status === 'Confirmed' && (
                  <button
                    onClick={() => handleCancelClick(booking.id)}
                    className="text-red-400 hover:text-red-300 text-xs font-medium transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingList;
