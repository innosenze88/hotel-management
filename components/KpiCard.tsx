
import React from 'react';

interface KpiCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  gradient: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, icon, gradient }) => {
  return (
    <div className={`bg-gradient-to-br ${gradient} p-6 rounded-xl shadow-lg text-white`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-medium text-gray-200">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className="w-12 h-12 flex items-center justify-center bg-white bg-opacity-20 rounded-full">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default KpiCard;
