import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as gtypes from "../types/global_types";

export default function MemoUpsert() {
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
  // 선택된 이미지 파일의 URL을 저장할 state
  const [imagePreviewUrl, setImagePreviewUrl] = useState<any>(null);
  // 선택된 실제 파일 객체를 저장할 state (필요시 사용)
  const [imageFile, setImageFile] = useState<any>(null);

  useEffect(() => {
    getMemo();
  }, []);

  // 파일 선택 변경 시 호출되는 핸들러 함수
  const handleImageChange = (e: any) => {
    const file = e.target.files[0];

    if (file) {
      // 1. 기존 URL이 있으면 해제
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }

      // 2. 새로운 파일 객체 저장
      setImageFile(file);

      // 3. 파일 URL을 생성하여 미리보기 state에 저장
      const newUrl = URL.createObjectURL(file);
      setImagePreviewUrl(newUrl);
    } else {
      // 파일 선택 취소 시 초기화
      setImageFile(null);
      setImagePreviewUrl(null);
    }
  };

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
      setMemo(
        result?.data ?? {
          content: "",
          createdDt: "",
          updatedDt: "",
          id: 0,
          title: "",
        }
      );
    } catch (error: any) {
      console.log(`서버 에러! ${error?.message ?? ""}`);
    }
  }

  async function onSave(event: React.MouseEvent) {
    event.preventDefault();
    // 제목 내용 둘다 입력해야 서버에 저장되게 하기
    const formData = new FormData();
    formData.append("title", memo?.title ?? "");
    formData.append("content", memo?.content ?? "");
    formData.append("id", String(memo?.id ?? 0));
    try {
      if (!memo.title || !memo.content) {
        alert(`제목과 내용을 입력해 주세요`);
        return;
      }
      const response = await fetch(`${API_BASE_URL}/api/board/upsert`, {
        method: "POST",
        body: formData, // FormData 객체를 body에 담습니다.
        headers: {
          Authorization: "",
        },
      });
      const result = await response.json(); // 서버 응답을 JSON으로 파싱
      if (!result?.success) {
        alert(`작성 실패. ${result?.msg}`);
        return;
      }
      navigate("/");
    } catch (error: any) {
      console.log(`업로드 에러! ${error?.message ?? ""}`);
    }
  }

  return (
    <div className="content-margin-padding">
      <div>메모 작성</div>

      <div>
        <h2>📥 이미지 파일 미리보기</h2>
        <br />
        {/* 1. 파일 입력 필드 */}
        <input
          type="file"
          accept="image/*" // 이미지 파일만 선택 가능하도록 설정
          onChange={handleImageChange}
          style={{ marginBottom: "20px" }}
        />

        {/* 2. 미리보기 영역 */}
        {imagePreviewUrl ? (
          <div style={{ marginTop: "10px" }}>
            <h3>미리보기:</h3>
            <img
              src={imagePreviewUrl}
              alt="Image Preview"
              // 미리보기 이미지가 너무 커지지 않도록 최대 너비 설정
              style={{
                width: "300px" /* 너비 300 픽셀로 고정 */,
                height: "200px" /* 높이 200 픽셀로 고정 */,
                objectFit: "cover" /* 컨테이너에 맞게 비율을 유지하며 채움 */,
                border: "2px solid #3498db",
              }}
            />
            <p>파일 이름: **{imageFile?.name}**</p>
          </div>
        ) : (
          <p>---</p>
        )}
      </div>

      <div>
        <form method="post" onSubmit={() => {}}>
          <div>
            <input
              value={memo?.title}
              placeholder="제목을 입력하세요"
              onChange={(event) => {
                setMemo({
                  ...memo,
                  title: event?.target?.value ?? "",
                });
              }}
              maxLength={300}
            />
            <textarea
              className="block p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border-2 border-black focus:ring-black focus:border-black dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white-400 dark:text-white dark:focus:ring-black dark:focus:border-black"
              placeholder="메모를 입력하세요"
              cols={100}
              rows={10}
              value={memo?.content}
              onChange={(event) => {
                setMemo({
                  ...memo,
                  content: event?.target?.value ?? "",
                });
              }}
              onKeyDown={(event) => {}}
              maxLength={1000}
            />
          </div>
          <br />
          <div className="flex">
            <button
              className="middle none center mr-4 rounded-lg bg-green-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-green-500/20 transition-all hover:shadow-lg hover:shadow-green-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-auto"
              data-ripple-light="true"
              onClick={onSave}
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
