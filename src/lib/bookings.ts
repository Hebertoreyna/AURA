/**
 * bookings.ts — Capa de acceso a Firestore para reservas de AURA
 *
 * Colección: `bookings`
 * Documento por reserva:
 *   date          string   "2026-05-28"
 *   time          string   "11:00 AM"
 *   ritualName    string
 *   specialistName string
 *   clientName    string
 *   clientEmail   string
 *   notes         string
 *   status        "pending" | "confirmed" | "cancelled"
 *   createdAt     Timestamp
 *
 * Reglas de Firestore sugeridas (Firebase Console → Firestore → Rules):
 *
 *   rules_version = '2';
 *   service cloud.firestore {
 *     match /databases/{database}/documents {
 *       match /bookings/{id} {
 *         allow read: if true;       // cualquier cliente puede ver slots ocupados
 *         allow create: if true;     // cualquier cliente puede crear una reserva
 *         allow update, delete: if false; // solo desde Firebase Console
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

export interface BookingRecord {
  date: string;
  time: string;
  ritualName: string;
  specialistName: string;
  clientName: string;
  clientEmail: string;
  notes: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

/**
 * Devuelve el conjunto de horarios ya reservados para una fecha dada.
 * Solo considera bookings con status != 'cancelled'.
 *
 * @param date  "YYYY-MM-DD"
 * @returns  Set<string> de horarios ocupados, e.g. Set { "11:00 AM", "03:30 PM" }
 */
export async function getBookedSlots(date: string): Promise<Set<string>> {
  const q = query(
    collection(db, 'bookings'),
    where('date', '==', date),
    where('status', 'in', ['pending', 'confirmed'])
  );
  const snapshot = await getDocs(q);
  const slots = new Set<string>();
  snapshot.forEach(doc => slots.add(doc.data().time as string));
  return slots;
}

/**
 * Guarda una reserva en Firestore con status "pending".
 * Se llama justo antes de abrir WhatsApp.
 */
export async function saveBooking(record: BookingRecord): Promise<string> {
  const docRef = await addDoc(collection(db, 'bookings'), {
    ...record,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}
