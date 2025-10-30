// 1. 상태 읽기 (READ)
// useAuthStore 훅을 통해 현재 상태에서 userInfo를 가져옵니다.

import { useShallow } from "zustand/shallow";
import { useAuthStore } from "../store/authStore";
import { auth } from "./firebaseConfig";

// 이 방법은 상태가 바뀔 때만 리렌더링됩니다.
const userInfo = useAuthStore((state) => state.userInfo);

// 2. 액션 함수 가져오기 (SET을 위한 함수)
const { login, logout } = useAuthStore(
  useShallow((state) => ({
    login: state.login,
    logout: state.logout,
  }))
);
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * 토큰 검증 함수.
 * 서버에서 문제있을시 alert 띄움.
 * 리엑트에서 문법에러 있을시 alert 띄움.
 * 토큰만료나 위조시 로그아웃 처리하고 alert 띄움.
 * 토큰이 정상이면 아무것도 안함.
 * return 값들은 혹시 몰라서 그냥 만들어 놓음.
 */
export async function verify_token(token: string) {
  try {
    if (!token) token = userInfo?.token ?? "";
    const response = await fetch(`${API_BASE_URL}/api/user/verify_token`, {
      method: "POST",
      body: token,
    });
    const result: any = await response.json();
    if (!result?.success) {
      alert(`서버 에러 ${result?.msg ?? ""}`);
      return `서버 에러 ${result?.msg ?? ""}`;
    }
    if (result?.data) {
      return "인증성공";
    }
    await auth.signOut();
    logout();
    alert(`로그인 기간이 만료 되었습니다. \n 로그인을 다시 해주세요.`);
    return "인증실패";
  } catch (error: any) {
    alert(`에러. ${error?.message ?? ""}`);
    return `에러. ${error?.message ?? ""}`;
  }
}
