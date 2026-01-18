
import React from 'react';
import { Arrival } from '../types';

const ArrivalsList: React.FC<{ arrivals: Arrival[] }> = ({ arrivals }) => {
  return (
    <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
      {arrivals.map(arrival => (
        <div key={arrival.id} className="flex justify-between items-center bg-gray-700/50 p-3 rounded-lg">
          <div>
            <p className="font-semibold text-white">{arrival.guestName}</p>
            <p className="text-xs text-gray-400">
              {arrival.roomType} - Room {arrival.roomNumber}
            </p>
          </div>
          <div className="flex items-center space-x-3">
             {arrival.isVip && (
              <span className="text-xs font-bold bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 px-2 py-1 rounded-full">
                VIP
              </span>
            )}
            <span className="text-sm text-gray-300 font-mono">{arrival.checkInTime}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ArrivalsList;
