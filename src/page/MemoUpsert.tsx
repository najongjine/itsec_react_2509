import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as gtypes from "../types/global_types";

// 기존에 생성된 URL을 해제(revoke)하는 함수
const revokeUrls = (urls: string[]) => {
  urls.forEach((url) => URL.revokeObjectURL(url));
};

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
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  useEffect(() => {
    getMemo();
    return () => {
      revokeUrls(imagePreviewUrls);
    };
  }, []);

  // 파일 선택 변경 시 호출되는 핸들러 함수
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    revokeUrls(imagePreviewUrls);

    if (selectedFiles.length > 0) {
      // 새로운 파일 객체 목록 저장
      setImageFiles(selectedFiles);

      // 파일 URL 목록을 생성하여 미리보기 state에 저장
      const newUrls = selectedFiles.map((file) => URL.createObjectURL(file));
      setImagePreviewUrls(newUrls);
    } else {
      // 파일 선택 취소 시 초기화
      setImageFiles([]);
      setImagePreviewUrls([]);
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
          multiple
          onChange={handleImageChange}
          className="mb-4 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none"
        />

        {/* 2. 미리보기 영역 */}
        {/* 2. 미리보기 영역 */}
        {imagePreviewUrls.length > 0 ? (
          <div className="mt-4 border-t pt-4">
            <h3 className="text-base font-medium mb-2">
              미리보기 ({imageFiles.length}개):
            </h3>
            <div className="flex flex-wrap gap-4">
              {/* URL 목록을 순회하며 모든 이미지 표시 */}
              {imagePreviewUrls.map((url, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center p-2 border rounded-lg bg-white shadow-md"
                >
                  <img
                    src={url}
                    alt={`Image Preview ${index + 1}`}
                    // 너비/높이를 픽셀로 고정
                    style={{
                      width: "150px" /* 너비 고정 */,
                      height: "100px" /* 높이 고정 */,
                      objectFit: "cover" /* 비율 유지하며 컨테이너 채움 */,
                    }}
                    className="rounded-md"
                  />
                  {/* 파일 이름 표시 (imageFiles 배열에서 가져옴) */}
                  <p className="text-xs mt-1 truncate max-w-[150px]">
                    **{imageFiles[index]?.name}**
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">선택된 이미지가 없습니다.</p>
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
