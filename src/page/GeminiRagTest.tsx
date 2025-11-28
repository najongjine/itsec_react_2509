import { useEffect, useState } from "react";

export default function GeminiRagTest() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [prompt, setPrompt] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 이미지 파일 선택 핸들러
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // 전송 및 스트리밍 처리 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt) return;

    setIsLoading(true);
    setAnswer(""); // 이전 답변 초기화

    try {
      // 1. FormData 생성
      const formData = new FormData();
      formData.append("prompt", prompt);
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      // 2. 요청 보내기
      const response = await fetch(
        `${API_BASE_URL}/api/gemini/gemini_rag_stream`,
        {
          method: "POST",
          body: formData, // Content-Type 헤더는 자동으로 설정됨 (multipart/form-data)
        }
      );

      if (!response.ok || !response.body) {
        throw new Error(response.statusText);
      }

      // 3. 스트림 리더 생성
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      // 4. 스트림 읽기 루프
      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        // 청크 디코딩 후 상태 업데이트 (기존 텍스트 뒤에 붙임)
        const chunk = decoder.decode(value, { stream: true });
        setAnswer((prev) => prev + chunk);
      }
    } catch (error) {
      console.error("Streaming error:", error);
      setAnswer("에러가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-[600px] mx-auto p-5">
      <h1 className="text-2xl font-bold mb-4">Gemini RAG + Vision Stream</h1>

      {/* 입력 폼 */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
        {/* 이미지 업로드 */}
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-slate-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100"
          />
          {previewUrl && (
            <div className="mt-2.5">
              <img
                src={previewUrl}
                alt="Preview"
                className="max-w-[100px] rounded-lg border border-gray-200"
              />
            </div>
          )}
        </div>

        {/* 텍스트 입력 */}
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="질문을 입력하세요..."
          rows={3}
          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
        />

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className={`p-2.5 rounded-lg text-white font-medium transition-colors
        ${
          isLoading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
        }`}
        >
          {isLoading ? "답변 생성 중..." : "전송"}
        </button>
      </form>

      {/* 결과 출력 */}
      <div className="mt-5 whitespace-pre-wrap border border-gray-200 p-4 rounded-lg min-h-[100px] bg-gray-50 text-gray-800 leading-relaxed">
        {answer || (
          <span className="text-gray-400">
            여기에 답변이 실시간으로 표시됩니다.
          </span>
        )}
      </div>
    </div>
  );
}
