import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as gtypes from "../types/global_types";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [memo, setMemo] = useState<gtypes.Memotype[]>([]);

  useEffect(() => {
    getMemoList();
  }, []);

  function onMemoDetail(id = 0) {
    navigate(`/memo_detail?id=${id}`);
  }

  function onMemoUpsert(id = 0) {
    navigate(`/memo_upsert?id=${id}`);
  }

  async function getMemoList() {
    const fetchOption = {
      method: "GET",
      headers: {
        Authorization: "",
      },
    };
    let res: any = await fetch(`${API_BASE_URL}/api/board`, fetchOption);
    res = await res.json();
    setMemo(res?.data ?? []);
    console.log(`## res: `, res);
  }

  return (
    <div className="content-margin-padding">
      <div>메모 List</div>

      <div>
        {memo.map((e) => (
          <div className="memo-item-container" key={e?.id}>
            <div
              className="memo-content"
              onClick={() => {
                onMemoDetail(e?.id);
              }}
            >
              {e.title}
            </div>
            <div className="memo-info-actions">
              <div className="memo-date">{e.createdDt}</div>
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
