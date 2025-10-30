import { useState } from "react"; // useState 추가
import "./Header.css";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useShallow } from "zustand/shallow";

export default function Header() {
  // 1. 상태 읽기 (READ)
  // useAuthStore 훅을 통해 현재 상태에서 userInfo를 가져옵니다.
  // 이 방법은 상태가 바뀔 때만 리렌더링됩니다.
  const userInfo = useAuthStore((state) => state.userInfo);

  // 2. 액션 함수 가져오기 (SET을 위한 함수)
  const { login, logout } = useAuthStore(
    useShallow((state) => ({
      login: state.login,
      logout: state.logout,
    }))
  );
  // UI 구현을 위한 임시 상태. 실제 기능 구현 시 변경될 수 있습니다.
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태
  const [userName, setUserName] = useState("a.com"); // 유저 이름

  // 버튼 클릭 핸들러 (UI 테스트용)
  const handleAuthClick = () => {
    // 실제 로그인/로그아웃 로직이 들어갈 곳
    if (isLoggedIn) {
      console.log("로그아웃 시도");
      setIsLoggedIn(false);
      setUserName(""); // 로그아웃 시 이름 초기화
    } else {
      console.log("로그인 시도");
      setIsLoggedIn(true);
      setUserName("a.com"); // 로그인 성공 시 이름 설정
    }
  };

  return (
    <div>
      <header>
        <h1>헤더에요</h1>
        <div className="header-right">
          {isLoggedIn ? (
            // 로그인 상태일 때
            <>
              <span className="user-info">{userName}님 환영합니다</span>
              <button className="auth-button" onClick={handleAuthClick}>
                로그아웃
              </button>
            </>
          ) : (
            // 로그아웃 상태일 때
            <button className="auth-button" onClick={handleAuthClick}>
              로그인
            </button>
          )}
        </div>
      </header>
      <ul className="topnav">
        <li>
          <Link to="/">홈</Link>
        </li>
        <li>
          <Link to="/memo">메모</Link>
        </li>
        <li>
          <Link to="/calc">계산기</Link>
        </li>
        <li>
          <Link to="/lotto">로또</Link>
        </li>
      </ul>
    </div>
  );
}
