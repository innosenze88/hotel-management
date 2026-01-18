
import React, { useState, useEffect } from 'react';
import { Room, Booking, User } from './types';
import { searchAvailableRooms, createBooking, fetchRooms } from './services/api';
import BookingConfirmation from './components/BookingConfirmation';

export default function BookingForm() {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingResult, setBookingResult] = useState<Booking | null>(null);
  const [allRooms, setAllRooms] = useState<Room[]>([]);

  useEffect(() => {
    // load rooms to allow quick preview even without search
    fetchRooms().then(setAllRooms).catch(() => {});
  }, []);

  async function handleSearch(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);
    setAvailableRooms([]);
    if (!startDate || !endDate) {
      setError('กรุณาเลือกวันที่เริ่มและวันที่สิ้นสุด');
      return;
    }
    if (new Date(startDate) >= new Date(endDate)) {
      setError('วันที่สิ้นสุดต้องหลังวันที่เริ่มต้น');
      return;
    }
    setLoading(true);
    try {
      const rooms = await searchAvailableRooms(startDate, endDate);
      setAvailableRooms(rooms);
      if (rooms.length === 0) {
        setError('ไม่มีห้องว่างในช่วงวันที่เลือก');
      }
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดขณะค้นหา');
    } finally {
      setLoading(false);
    }
  }

  async function handleBook(roomId: string) {
    setError(null);
    setLoading(true);
    try {
      // In this mock we create a guest user; replace with current user in real app
      const user: User = { id: 'guest', name: 'Guest User' };
      const booking = await createBooking({ roomId, user, startDate, endDate });
      setBookingResult(booking);
      // Refresh available list after booking
      handleSearch();
    } catch (err: any) {
      setError(err.message || 'ไม่สามารถทำการจองได้');
    } finally {
      setLoading(false);
    }
  }

  if (bookingResult) {
    return <BookingConfirmation booking={bookingResult} onClose={() => setBookingResult(null)} />;
  }

  const roomsToShow = availableRooms.length > 0 ? availableRooms : allRooms;

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 items-center flex-wrap">
        <div className="flex-1 min-w-[150px]">
          <label htmlFor="start-date" className="block text-sm font-medium text-gray-400 mb-1">Check-in Date</label>
          <input id="start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full bg-slate-700 border-slate-600 rounded-md shadow-sm p-2 text-white" />
        </div>
        <div className="flex-1 min-w-[150px]">
          <label htmlFor="end-date" className="block text-sm font-medium text-gray-400 mb-1">Check-out Date</label>
          <input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full bg-slate-700 border-slate-600 rounded-md shadow-sm p-2 text-white" />
        </div>
        <div className="w-full sm:w-auto pt-2 sm:pt-6">
          <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-500">
            {loading ? 'Searching...' : 'Search Rooms'}
          </button>
        </div>
      </form>

      {error && <div className="text-red-400 text-sm text-center">{error}</div>}

      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-200">{availableRooms.length > 0 ? 'Available Rooms' : 'Room Suggestions'}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-80 overflow-y-auto pr-2">
          {roomsToShow.map((r) => {
            const nights =
              startDate && endDate && new Date(endDate) > new Date(startDate)
                ? Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)))
                : 0;
            const total = nights * r.pricePerNight;
            const isBookable = availableRooms.length > 0 && nights > 0;

            return (
              <div key={r.id} className="bg-gray-700/50 p-4 rounded-lg flex flex-col">
                <div className="font-bold text-white">Room {r.roomNumber} - {r.type}</div>
                {r.description && <div className="text-sm text-gray-400 mt-1 flex-grow">{r.description}</div>}
                <div className="mt-4 text-sm space-y-1 text-gray-300">
                  <div><span className="font-medium text-gray-400">Capacity:</span> {r.capacity}</div>
                  <div><span className="font-medium text-gray-400">Price/night:</span> ฿{r.pricePerNight.toLocaleString()}</div>
                  {nights > 0 && <div><span className="font-medium text-gray-400">Total ({nights} nights):</span> ฿{total.toLocaleString()}</div>}
                </div>
                <div className="mt-4">
                  <button onClick={() => handleBook(r.id)} disabled={!isBookable || loading} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 rounded-lg transition-colors text-sm disabled:bg-gray-500 disabled:cursor-not-allowed">
                    {loading ? 'Booking...' : 'Book Now'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
