// src/firebaseConfig.ts

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// .env 파일 등에서 환경 변수로 관리하는 것을 권장합니다.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APIKEY,
  authDomain: import.meta.env.VITE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_PROJECTID,
  storageBucket: import.meta.env.VITE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGINGSENJDERID,
  appId: import.meta.env.VITE_APPID,
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// Auth 인스턴스 가져오기
export const auth = getAuth(app);

// 필요하다면 다른 서비스 (firestore, storage 등)도 여기서 export 합니다.
