
export enum RoomType {
  Single = 'Single',
  Double = 'Double',
  Suite = 'Suite',
  Deluxe = 'Deluxe',
  Presidential = 'Presidential'
}

export enum RoomStatus {
  Available = 'Available',
  Occupied = 'Occupied',
  Maintenance = 'Maintenance',
  Cleaning = 'Cleaning'
}

export interface Room {
  id: string;
  roomNumber: string;
  floor: number;
  type: RoomType;
  status: RoomStatus;
  capacity: number;
  pricePerNight: number;
  description?: string;
}

export interface Guest {
  id: string;
  name: string;
  isVip: boolean;
  loyaltyPoints: number;
}

export interface Arrival {
  id: string;
  guestName: string;
  isVip: boolean;
  roomNumber: string;
  roomType: RoomType;
  checkInTime: string;
}

export interface KpiData {
  occupancyRate: number;
  dailyRevenue: number;
  adr: number; // Average Daily Rate
  revPar: number; // Revenue Per Available Room
}

export interface ForecastPoint {
  date: string;
  occupancy: number;
}

// --- Merged types from booking system ---

export type BookingStatus = 'Confirmed' | 'Checked-in' | 'Checked-out' | 'Cancelled';

export interface Booking {
  id: string;
  roomId: string;
  userId: string;
  guestName: string;
  roomNumber: string;
  startDate: string; // ISO date (YYYY-MM-DD)
  endDate: string; // ISO date (YYYY-MM-DD)
  totalAmount: number;
  status: BookingStatus;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email?: string;
}
