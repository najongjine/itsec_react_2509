// 1. 상태 읽기 (READ)
// useAuthStore 훅을 통해 현재 상태에서 userInfo를 가져옵니다.

import { useShallow } from "zustand/shallow";
import { useAuthStore } from "../store/authStore";

// 이 방법은 상태가 바뀔 때만 리렌더링됩니다.
const userInfo = useAuthStore((state) => state.userInfo);

// 2. 액션 함수 가져오기 (SET을 위한 함수)
const { login, logout } = useAuthStore(
  useShallow((state) => ({
    login: state.login,
    logout: state.logout,
  }))
);

export async function verify_token(token: string) {}
