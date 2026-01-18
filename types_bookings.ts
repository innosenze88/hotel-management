export interface Room {
  id: string;
  name: string;
  description?: string;
  capacity: number;
  pricePerNight: number;
  images?: string[];
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Booking {
  id: string;
  roomId: string;
  userId: string;
  startDate: string; // ISO date (YYYY-MM-DD)
  endDate: string; // ISO date (YYYY-MM-DD)
  totalAmount: number;
  status: BookingStatus;
  createdAt: string;
  paymentId?: string;
}

export interface User {
  id: string;
  name: string;
  email?: string;
}