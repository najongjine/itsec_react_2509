// src/pages/LoginPage.tsx

import React, { useState } from "react";
import type { User } from "firebase/auth";
import GoogleSignInCompo from "../component/GoogleSignInCompo";
import { auth } from "../utils/firebaseConfig";
import { useAuthStore } from "../store/authStore";
import * as gtypes from "../types/global_types"; // 타입 경로는 필요에 따라 수정하세요.
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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

  const handleSuccess = async (user: User) => {
    setCurrentUser(user);
    setError(null);
    //alert(`로그인 성공! 환영합니다, ${user.displayName || user.email}`);
    /*
    profileUrl: string;
  uid: string;
  email: string;
  displayName: string;
  providerId: string;
  metadata: string;
     */
    const formData = new FormData();
    formData.append("profileUrl", String(user?.photoURL ?? ""));
    formData.append("uid", String(user?.uid ?? ""));
    formData.append("email", String(user?.email ?? ""));
    formData.append("displayName", String(user?.displayName ?? ""));
    formData.append("providerId", String(user?.providerId ?? ""));
    formData.append("metadata", JSON.stringify(user?.metadata ?? ""));
    const response = await fetch(`${API_BASE_URL}/api/board/delete`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: "",
      },
    });
    const result = await response.json(); // 서버 응답을 JSON으로 파싱
    if (!result?.success) {
      alert(`삭제 실패. ${result?.msg}`);
      return;
    }
    navigate("/");
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
