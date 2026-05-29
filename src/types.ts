/**
 * Types representing AURA Skincare & Wellness entity structures
 */

export interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  shortDescription: string;
  price: number;
  imageUrl: string;
  category: 'serum' | 'cleanser' | 'mask' | 'mist' | 'all';
  rating: number;
  reviewsCount: number;
  size: string;
  benefits: string[];
  ingredients: string[];
  howToUse: string;
  isBestSeller?: boolean;
}

export interface Ritual {
  id: string;
  name: string;
  badge?: string;
  category: 'cabina' | 'maquillaje';
  subcategory?: 'facial' | 'corporal'; // solo para category === 'cabina'
  duration: number; // in minutes
  price: number;    // 0 si customQuote = true
  customQuote?: boolean; // true = precio personalizado, primera cita es evaluación gratuita
  isAddon?: boolean;     // true = también disponible como complemento de otro facial (+$addonPrice)
  imageUrl: string;
  shortDescription: string;
  description: string;
  benefits: string[];
  steps: string[];
  therapists: string[];
}

export interface Specialist {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatarUrl: string;
}

export interface Appointment {
  id: string;
  ritualId: string;
  ritualName: string;
  ritualImageUrl: string;
  duration: number;
  price: number;
  dateTime: string; // ISO string or human-readable "May 28, 2026 at 10:00 AM"
  specialistName: string;
  specialistAvatar: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface SkinProfile {
  skinType: 'dry' | 'oily' | 'sensitive' | 'combination' | 'normal' | '';
  concern: 'dullness' | 'fine_lines' | 'hydration' | 'redness' | 'congestion' | '';
  vibe: 'minimalist' | 'balanced' | 'immersive' | '';
  completed: boolean;
}
