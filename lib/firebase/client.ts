"use client";

// Firebase Storage — dosya/resim yükleme. İndirme URL'leri Supabase'e kaydedilir.

import { getApp, getApps, initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Aynı uygulamayı tekrar başlatmamak için (HMR/SSR güvenli).
const app = getApps().length ? getApp() : initializeApp(config);

export const firebaseStorage = getStorage(app);
