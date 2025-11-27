// src/components/GoogleSignIn.tsx

import React, { useState } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect, // <--- 1. signInWithRedirect 추가
  AuthError,
} from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "../utils/firebaseConfig";

interface GoogleSignInProps {
  onSignInSuccess: (user: User) => void;
  onSignInError: (error: Error) => void;
}

// 🌐 현재 환경이 모바일 앱 WebView인지 확인하는 헬퍼 함수
// (UserAgent가 "Mozilla/5.0"으로 시작하고 "Mobile"이 포함된 경우를 포괄적으로 잡음)
const isRunningInMobileApp = () => {
  // 💡 참고: WebView에서는 UserAgent를 'Mozilla/5.0...'로 속여도
  // 모바일 기기 환경임을 유추할 수 있습니다.
  // 더 정확하게는, React Native 환경에서 URL 파라미터나 특정 변수를 전달받아 확인하는 것이 좋습니다.
  // 여기서는 간단한 UserAgent 검사를 사용합니다.
  const userAgent = navigator.userAgent;
  return /Android|iPhone|iPad/i.test(userAgent) || /Mobile|Tablet/i.test(userAgent);
};

const GoogleSignInCompo: React.FC<GoogleSignInProps> = ({ onSignInSuccess, onSignInError }) => {
  const [loading, setLoading] = useState(false);

  // 2. 모바일 앱 환경 여부 판단
  const isMobile = isRunningInMobileApp();
  const signInMethod = isMobile ? signInWithRedirect : signInWithPopup; // <--- 3. 로그인 방식 분기

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();

    // 'select_account'를 설정하여 매번 계정 선택 화면을 강제로 표시합니다.
    provider.setCustomParameters({
      prompt: "select_account",
    });

    try {
      // 팝업/리다이렉션 분기 처리
      const result = await signInMethod(auth, provider); // <--- 분기된 함수 사용

      // 팝업 방식(PC)은 result가 즉시 반환되지만,
      // 리다이렉션 방식(앱)은 페이지가 이동했다 돌아오므로 result가 undefined일 수 있습니다.
      if (result && result.user) {
        onSignInSuccess(result.user);
      }

      // 리다이렉션 방식의 경우, 이 코드는 페이지가 돌아온 후 실행됩니다.
      setLoading(false); // 성공 시 로딩 상태 해제
    } catch (error) {
      if (error && typeof error === "object" && "code" in error) {
        // Firebase AuthError 처리
        const authError = error as AuthError;

        // 팝업이 사용자에게 의해 닫히거나 취소된 경우
        if (authError.code === "auth/popup-closed-by-user" || authError.code === "auth/cancelled-popup-request") {
          console.log("Google Sign-In Pop-up was closed by the user.");
          setLoading(false);
          return;
        }

        // 리다이렉션 방식에서는 'auth/popup-closed-by-user' 오류가 발생하지 않으므로,
        // 이 로직은 PC에서 팝업을 닫았을 때만 주로 작동합니다.
        onSignInError(authError);
      } else if (error instanceof Error) {
        onSignInError(error);
      } else {
        onSignInError(new Error("알 수 없는 로그인 오류가 발생했습니다."));
      }

      setLoading(false);
    }
  };

  return (
    <button onClick={handleGoogleSignIn} disabled={loading} style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}>
      {loading ? "로그인 중..." : "Google로 로그인"}
      {/* 개발 편의를 위해 현재 로그인 방식 표시 */}
      <span style={{ fontSize: "10px", marginLeft: "5px" }}>({isMobile ? "Redirect Mode" : "Popup Mode"})</span>
    </button>
  );
};

export default GoogleSignInCompo;
