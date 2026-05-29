import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCrkSRYGAJuQyuB4VNG6Ty0oDc-93K4qp4',
  authDomain: 'aura-cosmetica.firebaseapp.com',
  projectId: 'aura-cosmetica',
  storageBucket: 'aura-cosmetica.firebasestorage.app',
  messagingSenderId: '307393298027',
  appId: '1:307393298027:web:4b6a9fad3916c22e677b2e',
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
