// 1. 상태 읽기 (READ)
// useAuthStore 훅을 통해 현재 상태에서 userInfo를 가져옵니다.

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**

 */
export async function verify_token(token: string) {
  try {
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
    return "인증실패";
  } catch (error: any) {
    alert(`에러. ${error?.message ?? ""}`);
    return `에러. ${error?.message ?? ""}`;
  }
}
