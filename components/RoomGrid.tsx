
import React, { useState } from 'react';
import { Room, RoomStatus } from '../types';
import BookingModal from './BookingModal';

interface RoomGridProps {
  rooms: Room[];
  onBookingSuccess: () => void;
}

const statusColors: Record<RoomStatus, string> = {
  [RoomStatus.Available]: 'bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/40',
  [RoomStatus.Occupied]: 'bg-red-500/20 text-red-300 border-red-500/30 hover:bg-red-500/40',
  [RoomStatus.Maintenance]: 'bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/40',
  [RoomStatus.Cleaning]: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30 hover:bg-yellow-500/40',
};

const RoomCard: React.FC<{ room: Room, onBook: (room: Room) => void }> = ({ room, onBook }) => (
  <div
    className={`p-3 rounded-lg border text-center transition-all duration-200 flex flex-col justify-between ${statusColors[room.status]}`}
  >
    <div>
      <div className="font-bold text-lg">{room.roomNumber}</div>
      <div className="text-xs opacity-80">{room.type}</div>
    </div>
    {room.status === RoomStatus.Available && (
        <button 
            onClick={() => onBook(room)}
            className="mt-2 text-xs bg-indigo-500/50 hover:bg-indigo-500/80 text-white font-semibold py-1 px-2 rounded-md transition-colors"
        >
            Book
        </button>
    )}
  </div>
);

const RoomGrid: React.FC<RoomGridProps> = ({ rooms, onBookingSuccess }) => {
  const [filter, setFilter] = useState<RoomStatus | 'All'>('All');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  
  const filteredRooms = rooms.filter(room => filter === 'All' || room.status === filter);

  const handleOpenBookingModal = (room: Room) => {
    setSelectedRoom(room);
    setIsBookingModalOpen(true);
  };

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedRoom(null);
  };

  const handleBookingSuccess = () => {
    handleCloseBookingModal();
    onBookingSuccess();
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {(['All', ...Object.values(RoomStatus)] as const).map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              filter === status ? 'bg-indigo-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
            }`}
          >
            {status}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
        {filteredRooms.map(room => (
          <RoomCard key={room.id} room={room} onBook={handleOpenBookingModal} />
        ))}
      </div>
      <BookingModal 
        isOpen={isBookingModalOpen}
        onClose={handleCloseBookingModal}
        onBookingSuccess={handleBookingSuccess}
        room={selectedRoom}
      />
    </div>
  );
};

export default RoomGrid;
