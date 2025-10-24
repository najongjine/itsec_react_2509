import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as gtypes from "../types/global_types";

export default function MemoDetail() {
  const [searchParams] = useSearchParams();
  const memoId = Number(searchParams?.get("id") ?? 0);
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [memo, setMemo] = useState<gtypes.Memotype>({
    content: "",
    createdDt: "",
    updatedDt: "",
    id: 0,
    title: "",
  });

  useEffect(() => {
    getMemo();
  }, []);

  function onMemoUpsert(id = 0) {
    navigate(`/memo_upsert?id=${id}`);
  }

  async function getMemo() {
    try {
      const fetchOption = {
        method: "GET",
        headers: {
          Authorization: "",
        },
      };
      let result: any = await fetch(
        `${API_BASE_URL}/api/board/get_memo_by_id?id=${memoId}`,
        fetchOption
      );
      result = await result.json();
      if (!result?.success) {
        alert(`메모 데이터 가져오기 실패. ${result?.msg}`);
        return;
      }
      setMemo({
        content: result?.data?.content ?? "",
        createdDt: result?.data?.createdDt ?? "",
        updatedDt: result?.data?.updatedDt ?? "",
        id: result?.data?.id ?? 0,
        title: result?.data?.title ?? "",
      });
    } catch (error: any) {
      console.log(`서버 에러! ${error?.message ?? ""}`);
    }
  }

  async function onDelete() {
    try {
      if (!confirm("정말 삭제 하시겠습니까?")) {
        return;
      }
      const formData = new FormData();
      formData.append("id", String(memo?.id ?? 0));
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
    } catch (error: any) {
      console.log(`서버 에러! ${error?.message ?? ""}`);
    }
  }

  return (
    <div className="content-margin-padding">
      <div>상세내용</div>

      <div>제목: {memo?.title}</div>
      <div>내용: {memo?.content}</div>

      <button
        onClick={() => {
          onMemoUpsert(memo?.id ?? 0);
        }}
      >
        수정
      </button>
      <br />
      <button
        onClick={() => {
          onDelete();
        }}
      >
        삭제
      </button>
      <br />
      <button
        onClick={() => {
          navigate(`/`);
        }}
      >
        리스트로 이동
      </button>
      <br />
    </div>
  );
}
