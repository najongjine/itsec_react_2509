// src/pages/LoginPage.tsx

import React, { useState } from "react";
import type { User } from "firebase/auth";
import GoogleSignInCompo from "../component/GoogleSignInCompo";
import { auth } from "../utils/firebaseConfig";
import { useAuthStore } from "../store/authStore";
import * as gtypes from "../types/global_types"; // 타입 경로는 필요에 따라 수정하세요.
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  // 1. 상태 읽기 (READ)
  // useAuthStore 훅을 통해 현재 상태에서 userInfo를 가져옵니다.
  // 이 방법은 상태가 바뀔 때만 리렌더링됩니다.
  const userInfo = useAuthStore((state) => state.userInfo);

  // 2. 액션 함수 가져오기 (SET을 위한 함수)
  const { login, logout } = useAuthStore((state) => ({
    login: state.login,
    logout: state.logout,
  }));
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // 컴포넌트 마운트 시, 로그인 상태 변화 리스너 설정 (선택 사항)
  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {});
    // 클린업 함수
    return unsubscribe;
  }, []);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      logout();
    } catch (e) {
      alert("로그아웃 오류 발생!");
    }
  };

  const handleSuccess = async (user: User) => {
    setError(null);
    //alert(`로그인 성공! 환영합니다, ${user.displayName || user.email}`);

    const formData = new FormData();
    formData.append("profileUrl", String(user?.photoURL ?? ""));
    formData.append("uid", String(user?.uid ?? ""));
    formData.append("email", String(user?.email ?? ""));
    formData.append("displayName", String(user?.displayName ?? ""));
    formData.append("providerId", String(user?.providerId ?? ""));
    formData.append("metadata", JSON.stringify(user?.metadata ?? ""));
    const response = await fetch(`${API_BASE_URL}/api/user/login_v2`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: "",
      },
    });
    let result: any = await response.json(); // 서버 응답을 JSON으로 파싱
    if (!result?.success) {
      alert(`로그인 실패. ${result?.msg}`);
      return;
    }

    let userInfo = result?.data?.userInfo ?? "";
    let token = result?.data?.token ?? "";
    if (!userInfo?.id || !token) {
      alert(`로그인 실패. 서버에서 중요정보 안보냄 ${result?.msg}`);
      return;
    }
    const fullUserInfo = {
      ...userInfo, // id, username, email 등
      token: token, // 토큰 추가
    };

    login(fullUserInfo, token);
    navigate("/");
  };

  const handleError = (err: Error) => {
    console.error(err);
    setError(`로그인 오류: ${err.message}`);
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>{userInfo?.id ? "로그아웃" : "로그인"} 페이지</h1>

      {userInfo?.id ? (
        // 로그인 상태
        <div>
          <p>📧 이메일: **{userInfo?.email ?? "-"}**</p>
          <p>👤 이름: **{userInfo?.displayName ?? "-"}**</p>
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
