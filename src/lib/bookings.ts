/**
 * bookings.ts — Capa de acceso a Firestore para reservas de AURA
 *
 * Colección: `bookings`
 * Documento por reserva:
 *   date             string   "2026-05-28"
 *   time             string   "8:00 AM"   (formato h:MM AM/PM, sin cero inicial)
 *   duration         number   minutos del ritual (50, 60, 90…)
 *   ritualName       string
 *   specialistName   string
 *   clientName       string
 *   clientEmail      string
 *   notes            string
 *   status           "pending" | "confirmed" | "cancelled"
 *   createdAt        Timestamp
 *
 * Reglas de Firestore sugeridas (Firebase Console → Firestore → Rules):
 *
 *   rules_version = '2';
 *   service cloud.firestore {
 *     match /databases/{database}/documents {
 *       match /bookings/{id} {
 *         allow read: if true;
 *         allow create: if true;
 *         allow update, delete: if false;
 *       }
 *     }
 *   }
 */

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

// ─── TIPOS ──────────────────────────────────────────────────────────────────

/** Un slot ya reservado: hora de inicio + duración del servicio */
export interface BookedSlot {
  time: string;     // "8:00 AM", "10:30 AM", etc.
  duration: number; // minutos
}

export interface BookingRecord {
  date: string;
  time: string;
  duration: number; // minutos del ritual — necesario para calcular solapamientos
  ritualName: string;
  specialistName: string;
  clientName: string;
  clientEmail: string;
  notes: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

// ─── HELPERS DE TIEMPO ──────────────────────────────────────────────────────

/**
 * Convierte "8:30 AM" / "03:30 PM" → minutos desde medianoche.
 * Acepta tanto formato con como sin cero inicial (legacy Firestore data).
 */
export function timeToMin(t: string): number {
  const [timePart, period] = t.trim().split(' ');
  const [hStr, mStr] = timePart.split(':');
  let h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  if (period === 'PM' && h !== 12) h += 12;
  if (period === 'AM' && h === 12) h = 0;
  return h * 60 + m;
}

/** Convierte minutos desde medianoche → "8:00 AM", "1:30 PM", etc. */
export function minToTime(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  const period = h >= 12 ? 'PM' : 'AM';
  const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${displayH}:${m.toString().padStart(2, '0')} ${period}`;
}

// ─── LÓGICA DE SLOTS ────────────────────────────────────────────────────────

const SALON_OPEN  = 8 * 60;   // 8:00 AM en minutos
const SALON_CLOSE = 19 * 60;  // 7:00 PM en minutos
const SLOT_INTERVAL   = 30;   // cada 30 min
export const SESSION_BUFFER = 30; // mínimo entre sesiones (minutos)

/**
 * Genera todos los horarios de inicio posibles para un ritual de `duration` minutos.
 * El último slot debe terminar exactamente en o antes de SALON_CLOSE.
 */
export function generateTimeSlots(duration: number): string[] {
  const slots: string[] = [];
  for (let t = SALON_OPEN; t + duration <= SALON_CLOSE; t += SLOT_INTERVAL) {
    slots.push(minToTime(t));
  }
  return slots;
}

/**
 * Determina si el slot `slotTime` para un ritual de `ritualDuration` minutos
 * está disponible dado un array de reservas existentes.
 *
 * Regla: debe haber al menos SESSION_BUFFER minutos entre el fin de una sesión
 * y el inicio de la siguiente (en cualquier dirección).
 */
export function isSlotAvailable(
  slotTime: string,
  ritualDuration: number,
  existingBookings: BookedSlot[]
): boolean {
  const slotStart = timeToMin(slotTime);
  const slotEnd   = slotStart + ritualDuration;

  for (const b of existingBookings) {
    const bStart = timeToMin(b.time);
    const bEnd   = bStart + b.duration;

    // Hay conflicto si el espacio entre ambas sesiones es menor a SESSION_BUFFER:
    //   nueva sesión empieza antes de que termine la existente + buffer
    //   Y la existente empieza antes de que termine la nueva + buffer
    if (slotStart < bEnd + SESSION_BUFFER && slotEnd > bStart - SESSION_BUFFER) {
      return false;
    }
  }
  return true;
}

// ─── ACCESO A FIRESTORE ─────────────────────────────────────────────────────

/**
 * Devuelve los slots reservados para una fecha dada, opcionalmente filtrados
 * por especialista. Incluye pending y confirmed; excluye cancelled.
 */
export async function getBookedSlots(
  date: string,
  specialistName?: string
): Promise<BookedSlot[]> {
  const q = query(
    collection(db, 'bookings'),
    where('date', '==', date),
    where('status', 'in', ['pending', 'confirmed'])
  );

  const snapshot = await getDocs(q);
  const slots: BookedSlot[] = [];

  snapshot.forEach(doc => {
    const data = doc.data();
    // Filtrar por especialista en memoria para evitar índice compuesto en Firestore
    if (!specialistName || data.specialistName === specialistName) {
      slots.push({
        time:     data.time     as string,
        duration: (data.duration as number) ?? 60, // fallback 60 min para reservas antiguas
      });
    }
  });

  return slots;
}

/**
 * Guarda una reserva en Firestore con status "pending".
 * Se llama de forma no-bloqueante justo después de abrir WhatsApp.
 */
export async function saveBooking(record: BookingRecord): Promise<string> {
  const docRef = await addDoc(collection(db, 'bookings'), {
    ...record,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}
