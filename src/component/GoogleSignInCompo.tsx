// src/components/GoogleSignIn.tsx

import React, { useState } from "react";
import { GoogleAuthProvider, signInWithPopup, AuthError } from "firebase/auth"; // AuthError 타입 추가
import type { User } from "firebase/auth";
import { auth } from "../utils/firebaseConfig"; // 1단계에서 만든 설정 파일

interface GoogleSignInProps {
  onSignInSuccess: (user: User) => void;
  onSignInError: (error: Error) => void;
}

const GoogleSignInCompo: React.FC<GoogleSignInProps> = ({
  onSignInSuccess,
  onSignInError,
}) => {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();

    // 'select_account'를 설정하여 매번 계정 선택 화면을 강제로 표시합니다.
    provider.setCustomParameters({
      prompt: "select_account",
    });

    try {
      // 팝업을 이용한 로그인
      const result = await signInWithPopup(auth, provider);
      // 로그인 성공 시 사용자 정보
      const user = result.user;

      onSignInSuccess(user);
      setLoading(false); // 성공 시 로딩 상태 해제
    } catch (error) {
      if (error && typeof error === "object" && "code" in error) {
        // Firebase AuthError 처리
        const authError = error as AuthError;
        // 팝업이 사용자에게 의해 닫히거나 취소된 경우
        if (
          authError.code === "auth/popup-closed-by-user" ||
          authError.code === "auth/cancelled-popup-request"
        ) {
          // 콘솔에만 기록하고 사용자에게는 에러 메시지를 보여주지 않음 (의도적인 취소로 간주)
          console.log("Google Sign-In Pop-up was closed by the user.");
          // **가장 중요**: 로딩 상태를 즉시 해제하여 버튼을 다시 활성화
          setLoading(false);
          return; // 성공/실패 콜백을 호출하지 않고 함수 종료
        }
        // 그 외 Firebase 오류 처리
        onSignInError(authError);
      } else if (error instanceof Error) {
        onSignInError(error);
      } else {
        onSignInError(new Error("알 수 없는 로그인 오류가 발생했습니다."));
      }

      setLoading(false); // 오류 발생 시 로딩 상태 해제
    }
    // finally 블록을 제거하여 실행 흐름을 단순화합니다.
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      disabled={loading}
      style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
    >
      {loading ? "로그인 중..." : "Google로 로그인"}
    </button>
  );
};

export default GoogleSignInCompo;
