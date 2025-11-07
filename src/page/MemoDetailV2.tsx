import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as gtypes from "../types/global_types";

export default function MemoDetailV2() {
  const [searchParams] = useSearchParams();
  const memoId = Number(searchParams?.get("id") ?? 0);
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [memo, setMemo] = useState<gtypes.MemoStrtype>({});

  // TiPtap 에디터에서 사용한 스타일을 상세 페이지에도 적용해야 합니다.
  // 특히 코드 블록(pre)에 대한 스타일은 필수입니다.
  const tiptapStyles = `
    .detail-content pre {
      background: #0f172a10;
      padding: 12px 14px;
      border-radius: 10px;
      overflow: auto;
      border: 1px solid #e5e7eb;
      margin: 10px 0;
    }
    .detail-content pre code {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      font-size: 13px;
      line-height: 1.5;
      white-space: pre;
    }
    .detail-content p {
        /* TiPtap에서 기본으로 생성하는 단락의 줄 간격 등을 맞출 수 있습니다. */
        line-height: 1.6;
        margin: 1em 0;
    }
    .detail-content img {
        /* 에디터에서 설정한 이미지 스타일 적용 */
        max-width:100%;
        height:auto;
        display:block;
        margin:8px 0;
    }
  `;

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
        `${API_BASE_URL}/api/board_v2/get_memo_by_id?id=${memoId}`,
        fetchOption
      );
      result = await result.json();
      if (!result?.success) {
        alert(`메모 데이터 가져오기 실패. ${result?.msg}`);
        return;
      }
      console.log(`# result?.data: `, result?.data);
      setMemo(result?.data);
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
      <div style={{ maxWidth: 760, margin: "24px auto", padding: 16 }}>
        {/* ⚠️ TiPtap에서 사용된 코드 블록 등의 스타일을 적용하기 위해 <style> 태그 삽입 */}
        <style>{tiptapStyles}</style>

        <h1>{memo?.title}</h1>
        <hr />

        {/* ⭐️ HTML을 렌더링하는 핵심 부분 ⭐️ */}
        <div
          className="detail-content"
          dangerouslySetInnerHTML={{ __html: memo?.htmlContent ?? "" }}
          style={{ minHeight: "200px", padding: "16px 0" }}
        />
      </div>

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
