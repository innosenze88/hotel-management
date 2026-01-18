
import { KpiData, Room, Arrival, ForecastPoint, RoomType, RoomStatus } from '../types';

const TOTAL_ROOMS = 50;

const roomTypes: RoomType[] = [
  RoomType.Single,
  RoomType.Double,
  RoomType.Suite,
  RoomType.Deluxe,
  RoomType.Presidential,
];

const roomStatuses: RoomStatus[] = [
  RoomStatus.Available,
  RoomStatus.Occupied,
  RoomStatus.Maintenance,
  RoomStatus.Cleaning,
];

const guestNames = [
  "John Doe", "Jane Smith", "Peter Jones", "Mary Williams", "David Brown", 
  "Susan Davis", "Michael Miller", "Linda Wilson", "Robert Moore", "Patricia Taylor"
];

// Simulate network delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// --- MOCK DATA GENERATORS ---

const generateMockRooms = (): Room[] => {
  const rooms: Room[] = [];
  for (let i = 0; i < TOTAL_ROOMS; i++) {
    const floor = Math.floor(i / 10) + 1;
    const roomNum = floor * 100 + (i % 10) + 1;
    rooms.push({
      id: `room-${i}`,
      roomNumber: roomNum.toString(),
      floor,
      type: roomTypes[i % roomTypes.length],
      status: roomStatuses[Math.floor(Math.random() * roomStatuses.length)],
    });
  }
  return rooms;
};

const generateMockArrivals = (rooms: Room[]): Arrival[] => {
  const arrivals: Arrival[] = [];
  const availableRooms = rooms.filter(r => r.status === RoomStatus.Available);
  const arrivalCount = Math.floor(Math.random() * 8) + 5;

  for (let i = 0; i < arrivalCount && i < availableRooms.length; i++) {
    const isVip = Math.random() > 0.8;
    const room = availableRooms[i];
    arrivals.push({
      id: `arrival-${i}`,
      guestName: guestNames[Math.floor(Math.random() * guestNames.length)],
      isVip,
      roomNumber: room.roomNumber,
      roomType: room.type,
      checkInTime: `${Math.floor(Math.random() * 8) + 14}:00`, // Between 14:00 and 21:00
    });
  }
  return arrivals.sort((a,b) => (a.isVip === b.isVip) ? 0 : a.isVip ? -1 : 1);
};


const generateMockForecast = (): ForecastPoint[] => {
    const forecast: ForecastPoint[] = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dayOfWeek = date.getDay();
        // Higher occupancy on weekends (Fri/Sat)
        const baseOccupancy = (dayOfWeek === 5 || dayOfWeek === 6) ? 75 : 50;
        forecast.push({
            date: date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
            occupancy: baseOccupancy + Math.random() * 20,
        });
    }
    return forecast;
};

// --- API FUNCTIONS ---

export const fetchKpis = async (): Promise<KpiData> => {
  await delay(500);
  const occupancyRate = Math.random() * 30 + 65; // 65% - 95%
  const dailyRevenue = Math.random() * 20000 + 35000; // $35k - $55k
  const adr = dailyRevenue / (TOTAL_ROOMS * (occupancyRate / 100));
  const revPar = dailyRevenue / TOTAL_ROOMS;

  return { occupancyRate, dailyRevenue, adr, revPar };
};

export const fetchRooms = async (): Promise<Room[]> => {
  await delay(700);
  return generateMockRooms();
};

export const fetchArrivals = async (): Promise<Arrival[]> => {
  await delay(900);
  // This is slightly inefficient as it generates rooms again, but fine for a mock API
  const rooms = generateMockRooms();
  return generateMockArrivals(rooms);
};

export const fetchForecast = async (): Promise<ForecastPoint[]> => {
  await delay(600);
  return generateMockForecast();
};
