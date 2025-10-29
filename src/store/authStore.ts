// src/stores/authStore.ts

import { create } from "zustand";
// createJSONStorage를 추가로 import 합니다.
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import * as gtypes from "../types/global_types";

// 2. 스토어 상태 인터페이스 정의
interface AuthState {
  // 사용자 정보 (null이면 로그아웃 상태)
  userInfo: gtypes.UserInfoType | null;

  // 액션 함수 정의
  login: (userInfo: gtypes.UserInfoType) => void;
  logout: () => void;
}

// 3. Zustand 스토어 생성
export const useAuthStore = create<AuthState>()(
  persist(
    devtools((set) => ({
      // 초기 상태: 로그인 상태 플래그 제거
      userInfo: null,

      // 로그인 액션
      login: (userInfo) =>
        set(
          {
            // userInfo에 데이터가 있으면 로그인된 상태로 간주
            userInfo: userInfo,
          },
          false,
          "auth/login"
        ),

      // 로그아웃 액션
      logout: () =>
        set(
          {
            userInfo: null, // userInfo를 null로 설정하여 로그아웃 상태로 변경
          },
          false,
          "auth/logout"
        ),
    })),
    {
      name: "auth-storage",

      // ✅ 에러 수정: getStorage 대신 storage 키를 사용하고,
      //    createJSONStorage 헬퍼를 사용하여 localStorage에 JSON 형식으로 저장하도록 처리
      storage: createJSONStorage(() => localStorage),

      // ... 기타 설정
    }
  )
);

// ✨ 유틸리티: 로그인 상태를 확인하는 셀렉터 함수
// 컴포넌트나 다른 훅에서 간단하게 로그인 상태를 확인할 때 사용합니다.
export const selectIsLoggedIn = (state: AuthState) => state.userInfo !== null;
