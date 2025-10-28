// src/components/GoogleSignIn.tsx

import React, { useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
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

    try {
      // 팝업을 이용한 로그인
      const result = await signInWithPopup(auth, provider);
      // 로그인 성공 시 사용자 정보
      const user = result.user;

      onSignInSuccess(user);
    } catch (error) {
      if (error instanceof Error) {
        onSignInError(error);
      } else {
        onSignInError(new Error("알 수 없는 로그인 오류가 발생했습니다."));
      }
    } finally {
      setLoading(false);
    }
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
