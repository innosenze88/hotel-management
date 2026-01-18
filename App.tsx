
import React, { useState, useEffect, useCallback } from 'react';
import { KpiData, Room, Arrival, ForecastPoint } from './types';
import * as api from './services/api';
import Header from './components/Header';
import KpiCard from './components/KpiCard';
import RoomGrid from './components/RoomGrid';
import ArrivalsList from './components/ArrivalsList';
import ForecastChart from './components/ForecastChart';
import LoadingSpinner from './components/LoadingSpinner';
import RoomManagementModal from './components/RoomManagementModal';
import { BedIcon, DollarSignIcon, UsersIcon, ChartBarIcon } from './components/icons';
import BookingForm from './components/BookingForm';

const App: React.FC = () => {
  const [kpis, setKpis] = useState<KpiData | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [arrivals, setArrivals] = useState<Arrival[]>([]);
  const [forecast, setForecast] = useState<ForecastPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);

  const fetchData = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError(null);
    try {
      const roomData = await api.fetchRooms();
      setRooms(roomData);

      const [kpiData, arrivalData, forecastData] = await Promise.all([
        api.fetchKpis(roomData),
        api.fetchArrivals(roomData),
        api.fetchForecast(),
      ]);
      setKpis(kpiData);
      setArrivals(arrivalData);
      setForecast(forecastData);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to fetch dashboard data. Please try again later.');
      console.error(err);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(false), 30000); // Auto-refresh every 30 seconds
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleSaveRooms = async (updatedRooms: Room[], closeModal = true) => {
      setLoading(true);
      setError(null);
      try {
          await api.saveRooms(updatedRooms);
          // Optimistically update state for a snappier feel and consistency
          setRooms(updatedRooms);
          const [kpiData, arrivalData] = await Promise.all([
              api.fetchKpis(updatedRooms),
              api.fetchArrivals(updatedRooms),
          ]);
          setKpis(kpiData);
          setArrivals(arrivalData);
          setLastUpdated(new Date());
      } catch (err) {
          setError('Failed to save room data. Please try again later.');
          console.error(err);
          // If save fails, refetch from storage to revert optimistic update
          await fetchData(false);
      } finally {
          if (closeModal) {
            setIsRoomModalOpen(false);
          }
          setLoading(false);
      }
  };

  const handleBookingSuccess = () => {
    // Refetch data without the main loading spinner to update KPIs, arrivals, etc.
    fetchData(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
      <Header lastUpdated={lastUpdated} isConnected={!error} />
      
      {error && (
        <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative my-4" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline ml-2">{error}</span>
        </div>
      )}

      {loading && !kpis ? (
        <div className="flex justify-center items-center h-screen">
          <LoadingSpinner />
        </div>
      ) : (
        <main className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <KpiCard
              title="Occupancy"
              value={`${kpis?.occupancyRate.toFixed(1)}%`}
              icon={<UsersIcon />}
              gradient="from-blue-500 to-indigo-600"
            />
            <KpiCard
              title="Daily Revenue"
              value={`$${(kpis?.dailyRevenue / 1000).toFixed(1)}k`}
              icon={<DollarSignIcon />}
              gradient="from-green-500 to-teal-600"
            />
            <KpiCard
              title="Avg. Daily Rate"
              value={`$${kpis?.adr.toFixed(2)}`}
              icon={<BedIcon />}
              gradient="from-purple-500 to-pink-600"
            />
            <KpiCard
              title="RevPAR"
              value={`$${kpis?.revPar.toFixed(2)}`}
              icon={<ChartBarIcon />}
              gradient="from-yellow-500 to-orange-600"
            />
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-gray-800 p-6 rounded-xl shadow-lg">
               <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Room Status</h2>
                <button 
                    onClick={() => setIsRoomModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm">
                    Manage Rooms
                </button>
              </div>
              <RoomGrid rooms={rooms} onBookingSuccess={handleBookingSuccess} />
            </div>
            <div className="space-y-8">
              <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold mb-4 text-white">Book a Room</h2>
                {/* FIX: Pass the required onBookingSuccess prop to BookingForm. */}
                <BookingForm onBookingSuccess={handleBookingSuccess} />
              </div>
              <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold mb-4 text-white">Today's Arrivals</h2>
                <ArrivalsList arrivals={arrivals} />
              </div>
              <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold mb-4 text-white">14-Day Occupancy Forecast</h2>
                <ForecastChart data={forecast} />
              </div>
            </div>
          </div>
        </main>
      )}
       <RoomManagementModal
            isOpen={isRoomModalOpen}
            onClose={() => setIsRoomModalOpen(false)}
            rooms={rooms}
            onSave={handleSaveRooms}
        />
    </div>
  );
};

export default App;
