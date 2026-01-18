
import { KpiData, Room, Arrival, ForecastPoint, RoomType, RoomStatus, Booking, User, BookingStatus } from '../types';

const ROOMS_KEY = 'hotel_pulse_rooms';
const BOOKINGS_KEY = 'hotel_pulse_bookings';
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

// --- Helper Functions ---
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
const generateId = () => `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// --- DATA INITIALIZATION & STORAGE (Rooms) ---
const generateInitialMockRooms = (): Room[] => {
  const rooms: Room[] = [];
  const details = {
      [RoomType.Single]: { price: 800, capacity: 1, desc: "A cozy room perfect for a solo traveler." },
      [RoomType.Double]: { price: 1200, capacity: 2, desc: "A spacious room with two beds, ideal for friends." },
      [RoomType.Suite]: { price: 2200, capacity: 4, desc: "A luxurious suite with a separate living area." },
      [RoomType.Deluxe]: { price: 1800, capacity: 2, desc: "An elegant room with premium amenities and a stunning view." },
      [RoomType.Presidential]: { price: 5000, capacity: 6, desc: "The ultimate in luxury, with multiple rooms and exclusive services." },
  };

  for (let i = 0; i < TOTAL_ROOMS; i++) {
    const floor = Math.floor(i / 10) + 1;
    const roomNum = floor * 100 + (i % 10) + 1;
    const type = roomTypes[i % roomTypes.length];
    
    rooms.push({
      id: generateId(),
      roomNumber: roomNum.toString(),
      floor,
      type: type,
      status: roomStatuses[Math.floor(Math.random() * roomStatuses.length)],
      pricePerNight: details[type].price,
      capacity: details[type].capacity,
      description: details[type].desc,
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

// --- DATA INITIALIZATION & STORAGE (Bookings) ---
function readBookings(): Booking[] {
  try {
    const raw = localStorage.getItem(BOOKINGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    localStorage.removeItem(BOOKINGS_KEY);
    return [];
  }
}

function writeBookings(bookings: Booking[]) {
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
}

// --- Booking Helper Functions ---
function datesOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string) {
  const s1 = new Date(aStart);
  const e1 = new Date(aEnd);
  const s2 = new Date(bStart);
  const e2 = new Date(bEnd);
  return s1 < e2 && s2 < e1;
}

function nightsBetween(startDate: string, endDate: string) {
  const s = new Date(startDate);
  const e = new Date(endDate);
  const msPerDay = 1000 * 60 * 60 * 24;
  const diff = e.getTime() - s.getTime();
  return Math.max(0, Math.ceil(diff / msPerDay));
}

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
  if (!rooms || rooms.length === 0) {
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

export const fetchBookings = async (): Promise<Booking[]> => {
  await delay(150);
  return readBookings();
};


// --- API FUNCTIONS (Bookings) ---
export async function searchAvailableRooms(startDate: string, endDate: string): Promise<Room[]> {
  // Fix: Added missing argument to the 'delay' function call.
  await delay(200);
  if (!startDate || !endDate) return [];
  
  const allRooms = await fetchRooms();
  const bookings = readBookings();

  // A room is available if there is no booking that overlaps and is not cancelled
  return allRooms.filter((room) => {
    const hasConflict = bookings.some((b) => 
      b.roomId === room.id && 
      b.status !== 'Cancelled' && 
      datesOverlap(b.startDate, b.endDate, startDate, endDate)
    );
    return !hasConflict;
  });
}

export async function createBooking(params: {
  roomId: string;
  user: User;
  startDate: string;
  endDate: string;
}): Promise<Booking> {
  // Fix: Added missing argument to the 'delay' function call.
  await delay(200);
  const { roomId, user, startDate, endDate } = params;

  const allRooms = await fetchRooms();
  const room = allRooms.find((r) => r.id === roomId);
  if (!room) throw new Error('Room not found');
  if (new Date(startDate) >= new Date(endDate)) throw new Error('Invalid date range');

  const existingBookings = readBookings();
  const hasConflict = existingBookings.some((b) => 
    b.roomId === roomId && 
    b.status !== 'Cancelled' && 
    datesOverlap(b.startDate, b.endDate, startDate, endDate)
  );
  if (hasConflict) throw new Error('Room is not available for selected dates');

  const nights = nightsBetween(startDate, endDate);
  const totalAmount = nights * room.pricePerNight;

  const newBooking: Booking = {
    id: `bk_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    roomId,
    userId: user.id,
    guestName: user.name,
    roomNumber: room.roomNumber,
    startDate,
    endDate,
    totalAmount,
    status: 'Confirmed',
    createdAt: new Date().toISOString()
  };

  const updatedBookings = [...existingBookings, newBooking];
  writeBookings(updatedBookings);
  return newBooking;
}

export const cancelBooking = async (bookingId: string): Promise<Booking> => {
  await delay(200);
  const bookings = readBookings();
  const bookingIndex = bookings.findIndex(b => b.id === bookingId);
  if (bookingIndex === -1) {
    throw new Error("Booking not found");
  }
  
  bookings[bookingIndex].status = 'Cancelled';
  writeBookings(bookings);
  return bookings[bookingIndex];
};
