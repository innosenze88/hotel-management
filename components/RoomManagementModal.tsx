
import React, { useState, useEffect } from 'react';
import { Room, RoomStatus, RoomType } from '../types';

interface RoomManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  rooms: Room[];
  onSave: (updatedRooms: Room[], closeModal?: boolean) => void;
}

const generateId = () => `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Fix: Add room details to derive properties from room type, preventing logic bugs for new rooms.
const roomDetailsMap = {
    [RoomType.Single]: { pricePerNight: 800, capacity: 1, description: "A cozy room perfect for a solo traveler." },
    [RoomType.Double]: { pricePerNight: 1200, capacity: 2, description: "A spacious room with two beds, ideal for friends." },
    [RoomType.Suite]: { pricePerNight: 2200, capacity: 4, description: "A luxurious suite with a separate living area." },
    [RoomType.Deluxe]: { pricePerNight: 1800, capacity: 2, description: "An elegant room with premium amenities and a stunning view." },
    [RoomType.Presidential]: { pricePerNight: 5000, capacity: 6, description: "The ultimate in luxury, with multiple rooms and exclusive services." },
};

// Fix: Added missing properties 'capacity' and 'pricePerNight' to fix the type error.
// Values are derived from the room type to ensure correctness.
const emptyRoomState: Omit<Room, 'id' | 'floor'> & { id: string | null; floor: string } = {
  id: null,
  roomNumber: '',
  floor: '1',
  type: RoomType.Single,
  status: RoomStatus.Available,
  capacity: roomDetailsMap[RoomType.Single].capacity,
  pricePerNight: roomDetailsMap[RoomType.Single].pricePerNight,
  description: roomDetailsMap[RoomType.Single].description,
};

const RoomManagementModal: React.FC<RoomManagementModalProps> = ({ isOpen, onClose, rooms, onSave }) => {
  const [currentRooms, setCurrentRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState(emptyRoomState);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Sync with external rooms state when modal opens
    if (isOpen) {
      setCurrentRooms([...rooms].sort((a, b) => a.roomNumber.localeCompare(b.roomNumber)));
    }
  }, [rooms, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      // Reset form state when modal closes
      setSelectedRoom(emptyRoomState);
      setIsEditing(false);
    }
  }, [isOpen]);

  const handleSelectForEdit = (room: Room) => {
    setSelectedRoom({ ...room, floor: room.floor.toString() });
    setIsEditing(true);
  };

  const handleDelete = (roomId: string) => {
    // Prompt for confirmation before proceeding with deletion.
    const isConfirmed = window.confirm('Are you sure you want to delete this room? This action cannot be undone.\n\nคุณแน่ใจหรือไม่ว่าต้องการลบห้องนี้? การกระทำนี้ไม่สามารถย้อนกลับได้');
    
    if (isConfirmed) {
      const updatedRooms = currentRooms.filter(r => r.id !== roomId);
      
      // Update internal state immediately for a responsive UI
      setCurrentRooms(updatedRooms);
      
      // If the room being edited is deleted, reset the form to prevent inconsistencies.
      if (isEditing && selectedRoom.id === roomId) {
        setSelectedRoom(emptyRoomState);
        setIsEditing(false);
      }
      
      // Call onSave to persist the deletion but keep the modal open.
      onSave(updatedRooms, false);
    }
  };

  // Fix: Update form change handler to automatically update room properties based on type.
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSelectedRoom(prev => {
        const newState = { ...prev, [name]: value };
        if (name === 'type') {
            const details = roomDetailsMap[value as RoomType];
            if (details) {
                newState.capacity = details.capacity;
                newState.pricePerNight = details.pricePerNight;
                newState.description = details.description;
            }
        }
        return newState;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const floor = parseInt(selectedRoom.floor, 10);
    if (!selectedRoom.roomNumber.trim() || isNaN(floor) || floor <= 0) {
      alert('Please ensure Room Number is filled and Floor is a positive number.');
      return;
    }
    
    let updatedRooms: Room[];
    const roomData = { ...selectedRoom, floor, roomNumber: selectedRoom.roomNumber.trim(), id: selectedRoom.id || generateId() } as Room;

    if (isEditing) {
      updatedRooms = currentRooms.map(r => r.id === roomData.id ? roomData : r);
    } else {
      if (currentRooms.some(r => r.roomNumber === roomData.roomNumber)) {
        alert(`Room number ${roomData.roomNumber} already exists.`);
        return;
      }
      updatedRooms = [...currentRooms, roomData];
    }
    
    setCurrentRooms(updatedRooms.sort((a, b) => a.roomNumber.localeCompare(b.roomNumber)));
    setSelectedRoom(emptyRoomState);
    setIsEditing(false);
  };
  
  const handleSaveChanges = () => {
      // Call onSave and instruct it to close the modal.
      onSave(currentRooms, true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-4xl h-full max-h-[650px] flex flex-col p-6 text-white">
        <div className="flex justify-between items-center border-b border-slate-700 pb-4 mb-4">
          <h2 className="text-2xl font-bold">Manage Rooms</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
        </div>

        <div className="flex-grow flex flex-col md:flex-row gap-6 overflow-hidden">
          {/* Form Section */}
          <div className="w-full md:w-1/3 flex-shrink-0 bg-slate-900 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">{isEditing ? 'Edit Room' : 'Add New Room'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-400">Room Number</label>
                <input type="text" name="roomNumber" value={selectedRoom.roomNumber} onChange={handleFormChange} className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" required />
              </div>
              <div>
                <label htmlFor="floor" className="block text-sm font-medium text-gray-400">Floor</label>
                <input type="number" name="floor" value={selectedRoom.floor} onChange={handleFormChange} className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" min="1" required />
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-400">Room Type</label>
                <select name="type" value={selectedRoom.type} onChange={handleFormChange} className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2">
                  {Object.values(RoomType).map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-400">Status</label>
                <select name="status" value={selectedRoom.status} onChange={handleFormChange} className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2">
                  {Object.values(RoomStatus).map(status => <option key={status} value={status}>{status}</option>)}
                </select>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button type="submit" className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105">{isEditing ? 'Update' : 'Add'}</button>
                {isEditing && <button type="button" onClick={() => { setIsEditing(false); setSelectedRoom(emptyRoomState); }} className="w-full bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">Cancel</button>}
              </div>
            </form>
          </div>

          {/* List Section */}
          <div className="w-full md:w-2/3 flex flex-col flex-shrink-0 bg-slate-900 p-4 rounded-lg overflow-hidden">
            <div className="flex-grow overflow-y-auto pr-2">
              <div className="space-y-2">
                {currentRooms.length > 0 ? currentRooms.map(room => (
                  <div key={room.id} className={`flex justify-between items-center bg-slate-800 p-3 rounded-lg ${selectedRoom.id === room.id ? 'ring-2 ring-indigo-500' : ''}`}>
                    <div>
                      <p className="font-semibold">Room {room.roomNumber} <span className="text-xs text-gray-400">({room.type})</span></p>
                      <p className="text-sm text-gray-300">Floor: {room.floor} | Status: {room.status}</p>
                    </div>
                    <div className="flex gap-4">
                      <button onClick={() => handleSelectForEdit(room)} className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">Edit</button>
                      <button onClick={() => handleDelete(room.id)} className="text-red-500 hover:text-red-400 text-sm font-medium">Delete</button>
                    </div>
                  </div>
                )) : (
                  <div className="text-center text-slate-500 pt-10">No rooms found. Add one to get started!</div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-700 pt-4 mt-4 flex justify-end gap-4">
            <button onClick={onClose} className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
              Cancel
            </button>
            <button onClick={handleSaveChanges} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
              Save All Changes
            </button>
        </div>
      </div>
    </div>
  );
};

export default RoomManagementModal;
