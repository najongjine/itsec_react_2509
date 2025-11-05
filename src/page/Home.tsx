import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as gtypes from "../types/global_types";
import * as utils from "../utils/utils";
import { useShallow } from "zustand/shallow";
import { useAuthStore } from "../store/authStore";
import { auth } from "../utils/firebaseConfig";
import "./Home.css";

export default function Home() {
  // 이 방법은 상태가 바뀔 때만 리렌더링됩니다.
  const userInfo = useAuthStore((state) => state.userInfo);

  // 2. 액션 함수 가져오기 (SET을 위한 함수)
  const { login, logout } = useAuthStore(
    useShallow((state) => ({
      login: state.login,
      logout: state.logout,
    }))
  );
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [board, setBoard] = useState<gtypes.BoardType[]>([]);

  useEffect(() => {
    validation();
    getBoardList();
  }, []);

  async function validation() {
    let result = await utils.verify_token(userInfo?.token ?? "");
    if (result.includes("인증실패")) {
      alert(`${result}. 로그인을 다시 해주세요.`);
      await auth.signOut();
      logout();
    }
  }

  function onMemoDetail(id = 0) {
    navigate(`/memo_detail?id=${id}`);
  }

  function onMemoUpsert(id = 0) {
    navigate(`/memo_upsert?id=${id}`);
  }

  async function getBoardList() {
    const fetchOption = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userInfo?.token ?? ""}`,
      },
    };
    try {
      let res: any = await fetch(`${API_BASE_URL}/api/board`, fetchOption);
      res = await res.json();
      if (!res?.success) {
        alert(`서버 에러. ${res?.msg ?? ""}`);
        return;
      }
      setBoard(res?.data ?? []);
      console.log(`## res: `, res);
    } catch (error: any) {
      alert(`에러. ${error?.message ?? ""}`);
      return;
    }
  }

  return (
    <div className="content-margin-padding">
      <div>메모 List</div>

      <div>
        {board.map((e) => (
          <div className="memo-item-container" key={e?.board_id}>
            <div
              className="memo-content"
              onClick={() => {
                onMemoDetail(e?.board_id);
              }}
            >
              {e.title}
            </div>

            <div className="memo-info-actions">
              <div className="memo-date">
                {e?.user_display_name ?? "test-user"}{" "}
              </div>
              <div className="memo-date">{e.board_created_dt}</div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <button
          onClick={() => {
            onMemoUpsert(0);
          }}
        >
          new
        </button>
      </div>
    </div>
  );
}
