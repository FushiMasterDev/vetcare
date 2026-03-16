// src/types/index.ts

export type Role = 'ADMIN' | 'DOCTOR' | 'STAFF' | 'USER';
export type AuthProvider = 'LOCAL' | 'GOOGLE' | 'FACEBOOK';
export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';

export interface User {
  id: number;
  email: string;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  address?: string;
  role: Role;
  provider: AuthProvider;
  active: boolean;
  emailVerified: boolean;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  userId: number;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: Role;
}

export interface Service {
  id: number;
  name: string;
  description: string;
  shortDescription?: string;
  imageUrl?: string;
  price?: number;
  durationMinutes?: number;
  specialization: string;
  symptoms: string[];
  active: boolean;
  avgRating?: number;
  totalReviews?: number;
  createdAt: string;
}

export interface Branch {
  id: number;
  name: string;
  address: string;
  city?: string;
  phone?: string;
  email?: string;
  imageUrl?: string;
  mapUrl?: string;
  latitude?: number;
  longitude?: number;
  openingHours?: string;
  description?: string;
  active: boolean;
  createdAt: string;
}

export interface Doctor {
  id: number;
  userId: number;
  fullName: string;
  email: string;
  avatarUrl?: string;
  specialization: string;
  licenseNumber?: string;
  education?: string;
  experience?: string;
  bio?: string;
  yearsOfExperience?: number;
  rating?: number;
  totalReviews?: number;
  branch?: Branch;
  services?: Service[];
  active: boolean;
  createdAt: string;
}

export interface Appointment {
  id: number;
  user: User;
  doctor: Doctor;
  service: Service;
  branch: Branch;
  petName?: string;
  petType?: string;
  appointmentDate: string;
  appointmentTime: string;
  reason: string;
  notes?: string;
  status: AppointmentStatus;
  termsAccepted: boolean;
  cancelReason?: string;
  createdAt: string;
}

export interface Post {
  id: number;
  author: User;
  title: string;
  content: string;
  imageUrl?: string;
  category?: string;
  tags?: string;
  likes: number;
  views: number;
  commentCount: number;
  published: boolean;
  likedByCurrentUser: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: number;
  user: User;
  content: string;
  likes: number;
  parentId?: number;
  replies: Comment[];
  createdAt: string;
}

export interface Review {
  id: number;
  user: User;
  serviceId?: number;
  doctorId?: number;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface Pet {
  id: number;
  userId: number;
  name: string;
  species?: string;
  breed?: string;
  gender?: string;
  birthday?: string;
  weight?: number;
  avatarUrl?: string;
  notes?: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalDoctors: number;
  totalServices: number;
  totalAppointments: number;
  confirmedAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
}

export interface ApiError {
  status: number;
  message: string;
  timestamp: string;
}
