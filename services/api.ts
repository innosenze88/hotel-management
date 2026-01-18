
import { KpiData, Room, Arrival, ForecastPoint, RoomType, RoomStatus } from '../types';

const ROOMS_KEY = 'hotel_pulse_rooms';
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

const generateId = () => `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// --- DATA INITIALIZATION & STORAGE ---

const generateInitialMockRooms = (): Room[] => {
  const rooms: Room[] = [];
  for (let i = 0; i < TOTAL_ROOMS; i++) {
    const floor = Math.floor(i / 10) + 1;
    const roomNum = floor * 100 + (i % 10) + 1;
    rooms.push({
      id: generateId(),
      roomNumber: roomNum.toString(),
      floor,
      type: roomTypes[i % roomTypes.length],
      status: roomStatuses[Math.floor(Math.random() * roomStatuses.length)],
    });
  }
  return rooms;
};

const getRoomsFromStorage = (): Room[] | null => {
  try {
    const roomsJson = localStorage.getItem(ROOMS_KEY);
    return roomsJson ? JSON.parse(roomsJson) : null;
  } catch (error) {
    console.error("Failed to parse rooms from localStorage", error);
    localStorage.removeItem(ROOMS_KEY);
    return null;
  }
};

export const saveRooms = async (rooms: Room[]): Promise<void> => {
    try {
        const roomsJson = JSON.stringify(rooms);
        localStorage.setItem(ROOMS_KEY, roomsJson);
    } catch (error) {
        console.error("Failed to save rooms to localStorage", error);
        throw error; // Propagate error
    }
    await delay(100); // simulate async save
};

// --- DYNAMIC DATA GENERATORS ---

const generateDynamicArrivals = (rooms: Room[]): Arrival[] => {
  const arrivals: Arrival[] = [];
  const availableRooms = rooms.filter(r => r.status === RoomStatus.Available);
  const arrivalCount = Math.min(availableRooms.length, Math.floor(Math.random() * 8) + 5);

  for (let i = 0; i < arrivalCount; i++) {
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

export const fetchRooms = async (): Promise<Room[]> => {
  await delay(200);
  let rooms = getRoomsFromStorage();
  if (!rooms) {
    rooms = generateInitialMockRooms();
    await saveRooms(rooms);
  }
  return rooms;
};

export const fetchKpis = async (rooms?: Room[]): Promise<KpiData> => {
  await delay(rooms ? 50 : 300);
  const roomsData = rooms || await fetchRooms();
  const totalRooms = roomsData.length;
  
  if (totalRooms === 0) {
      return { occupancyRate: 0, dailyRevenue: 0, adr: 0, revPar: 0 };
  }

  const occupiedRoomsCount = roomsData.filter(r => r.status === RoomStatus.Occupied).length;
  const occupancyRate = (occupiedRoomsCount / totalRooms) * 100;
  
  // Simulate revenue based on occupied rooms for more realism
  const dailyRevenue = (occupiedRoomsCount * (Math.random() * 150 + 200)); 
  const adr = occupiedRoomsCount > 0 ? dailyRevenue / occupiedRoomsCount : 0;
  const revPar = dailyRevenue / totalRooms;

  return { occupancyRate, dailyRevenue, adr, revPar };
};

export const fetchArrivals = async (rooms?: Room[]): Promise<Arrival[]> => {
  await delay(rooms ? 100 : 400);
  const roomsData = rooms || await fetchRooms();
  return generateDynamicArrivals(roomsData);
};

export const fetchForecast = async (): Promise<ForecastPoint[]> => {
  await delay(350);
  return generateMockForecast();
};
