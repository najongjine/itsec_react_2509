// src/pages/LoginPage.tsx

import React, { useState } from "react";
import type { User } from "firebase/auth";
import GoogleSignInCompo from "../component/GoogleSignInCompo";
import { auth } from "../utils/firebaseConfig";

const LoginPage: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 컴포넌트 마운트 시, 로그인 상태 변화 리스너 설정 (선택 사항)
  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    // 클린업 함수
    return unsubscribe;
  }, []);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      setCurrentUser(null);
    } catch (e) {
      alert("로그아웃 오류 발생!");
    }
  };

  const handleSuccess = (user: User) => {
    setCurrentUser(user);
    setError(null);
    alert(`로그인 성공! 환영합니다, ${user.displayName || user.email}`);
  };

  const handleError = (err: Error) => {
    console.error(err);
    setError(`로그인 오류: ${err.message}`);
    setCurrentUser(null);
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>{currentUser ? "로그아웃" : "로그인"} 페이지</h1>

      {currentUser ? (
        // 로그인 상태
        <div>
          <p>📧 이메일: **{currentUser.email}**</p>
          <p>👤 이름: **{currentUser.displayName || "없음"}**</p>
          <button onClick={handleSignOut} style={{ marginTop: "10px" }}>
            로그아웃
          </button>
          {}
        </div>
      ) : (
        // 로그아웃 상태
        <>
          <GoogleSignInCompo
            onSignInSuccess={handleSuccess}
            onSignInError={handleError}
          />
          {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
        </>
      )}
    </div>
  );
};

export default LoginPage;
