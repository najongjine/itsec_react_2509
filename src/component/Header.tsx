import { useState } from "react";
import "./Header.css";
// useLocation을 import 합니다.
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useShallow } from "zustand/shallow";

export default function Header() {
  const userInfo = useAuthStore((state) => state?.userInfo);
  const { login, logout } = useAuthStore(
    useShallow((state) => ({
      login: state.login,
      logout: state.logout,
    }))
  );
  const navigate = useNavigate();
  // 1. 현재 라우트 정보를 가져옵니다.
  const location = useLocation();

  // 2. 현재 경로가 /imgtest 인지 확인합니다.
  const isImgTestPage = location.pathname === "/imgtest";

  return (
    <div>
      <header>
        <h1>헤더에요 </h1>
        <div className="header-right">
          {userInfo?.id ? (
            // 로그인 상태일 때
            <>
              <span className="user-info">
                {userInfo?.displayName ?? ""}님 환영합니다
              </span>
              <button
                className="auth-button"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                로그아웃
              </button>
            </>
          ) : (
            // 로그아웃 상태일 때
            <button
              className="auth-button"
              onClick={() => {
                navigate("/login");
              }}
            >
              로그인
            </button>
          )}
        </div>
      </header>
      <ul className="topnav">
        <li>
          <Link to="/" className={location.pathname === "/" ? "active" : ""}>
            홈
          </Link>
        </li>
        <li>
          <Link
            to="/memo_upsert"
            className={location.pathname === "/memo_upsert" ? "active" : ""}
          >
            메모
          </Link>
        </li>
        <li>
          {/* 현재 페이지가 /imgtest 일 때만 'active' 클래스 추가 */}
          <Link to="/imgtest" className={isImgTestPage ? "active" : ""}>
            CNN
          </Link>
        </li>
        <li>
          <Link to="/calc">계산기</Link>
        </li>
        <li>
          <Link to="/lotto">로또</Link>
        </li>
      </ul>

      {/* 3. 현재 경로가 /imgtest일 경우에만 서브 메뉴를 렌더링합니다. */}
      {isImgTestPage && (
        <ul className="subnav">
          <li>
            {/* 서브 메뉴 링크 (예시: 기본 모델) */}
            <Link to="/imgtest?model=base">기본 모델</Link>
          </li>
          <li>
            {/* 서브 메뉴 링크 (예시: 파인튜닝 모델) */}
            <Link to="/imgtest?model=fine">파인튜닝 모델</Link>
          </li>
        </ul>
      )}
      {/* 서브 메뉴가 Header.tsx 파일의 반환값에 포함되므로, ImgTest.tsx 파일은 수정할 필요가 없습니다. */}
    </div>
  );
}
