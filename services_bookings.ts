import { Room, Booking, User } from '../types/bookings';

const STORAGE_KEY = 'hotel:bookings_v1';

// --- Mock rooms (replace/extend with real data or import metadata.json) ---
const mockRooms: Room[] = [
  { id: 'r1', name: 'Deluxe Room', capacity: 2, pricePerNight: 1200, images: [] },
  { id: 'r2', name: 'Family Suite', capacity: 4, pricePerNight: 2200, images: [] },
  { id: 'r3', name: 'Single Room', capacity: 1, pricePerNight: 800, images: [] }
];

// --- Helpers ---
function readBookings(): Booking[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Booking[];
  } catch {
    return [];
  }
}

function writeBookings(bookings: Booking[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

function datesOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string) {
  // aStart < bEnd && bStart < aEnd
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

// --- API (mock with Promise + small delay) ---
const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms));

export async function listRooms(): Promise<Room[]> {
  await delay();
  // In a real app you might fetch metadata or backend; for now return mockRooms
  return mockRooms;
}

/**
 * Search available rooms between startDate (inclusive) and endDate (exclusive)
 * Dates should be in YYYY-MM-DD format.
 */
export async function searchAvailableRooms(startDate: string, endDate: string): Promise<Room[]> {
  await delay();
  if (!startDate || !endDate) return [];
  const bookings = readBookings();
  // A room is available if there is no booking that overlaps and is not cancelled
  return mockRooms.filter((room) => {
    const hasConflict = bookings.some((b) => b.roomId === room.id && b.status !== 'cancelled' && datesOverlap(b.startDate, b.endDate, startDate, endDate));
    return !hasConflict;
  });
}

export async function getRoomById(roomId: string): Promise<Room | undefined> {
  await delay();
  return mockRooms.find((r) => r.id === roomId);
}

export async function createBooking(params: {
  roomId: string;
  user: User;
  startDate: string;
  endDate: string;
}): Promise<Booking> {
  await delay();
  const { roomId, user, startDate, endDate } = params;
  // Basic validation
  const room = mockRooms.find((r) => r.id === roomId);
  if (!room) throw new Error('Room not found');
  if (new Date(startDate) >= new Date(endDate)) throw new Error('Invalid date range');

  // Check availability
  const existing = readBookings().some((b) => b.roomId === roomId && b.status !== 'cancelled' && datesOverlap(b.startDate, b.endDate, startDate, endDate));
  if (existing) throw new Error('Room is not available for selected dates');

  const nights = nightsBetween(startDate, endDate);
  const totalAmount = nights * room.pricePerNight;

  const booking: Booking = {
    id: `bk_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    roomId,
    userId: user.id,
    startDate,
    endDate,
    totalAmount,
    status: 'confirmed', // in mock we directly confirm
    createdAt: new Date().toISOString()
  };

  const bookings = readBookings();
  bookings.push(booking);
  writeBookings(bookings);
  return booking;
}

export async function getBookingsForUser(userId: string): Promise<Booking[]> {
  await delay();
  return readBookings().filter((b) => b.userId === userId);
}

export async function cancelBooking(bookingId: string): Promise<Booking> {
  await delay();
  const bookings = readBookings();
  const idx = bookings.findIndex((b) => b.id === bookingId);
  if (idx === -1) throw new Error('Booking not found');
  bookings[idx].status = 'cancelled';
  writeBookings(bookings);
  return bookings[idx];
}