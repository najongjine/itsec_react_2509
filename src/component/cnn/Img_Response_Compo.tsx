import { useEffect, useState } from "react";

interface Img_Response_Compo_Props {
  apiUrl: string;
  componentTitle: string;
}
export default function Img_Response_Compo({
  apiUrl,
  componentTitle,
}: Img_Response_Compo_Props) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [predict1, setPredict1] = useState<any[]>();
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("");

  // 파일 입력 변경 핸들러
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // files[0]을 가져오고, 파일이 선택되지 않았을 경우 null로 설정
    const file = event.target.files ? event.target.files[0] : null;
    setSelectedFile(file);
    setError(null); // 에러 초기화
    if (file) {
      // 파일이 Blob/File 객체일 때만 실행됩니다.
      const newUrl = URL.createObjectURL(file);
      setImagePreviewUrl(newUrl);
    } else {
      // 파일이 선택 해제되었거나 없을 경우, 기존 URL을 해제하고 초기화합니다.
      // 주의: 기존 URL이 있다면 해제해야 메모리 누수를 방지합니다.
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl); // 기존 URL 해제
      }
      setImagePreviewUrl("");
    }
  };

  useEffect(() => {}, []);

  // 파일 업로드 핸들러
  const handleFileUpload = async () => {
    if (!selectedFile) {
      setError("⚠️ 파일을 먼저 선택해 주세요.");
      return;
    }

    setIsLoading(true);
    setError(null);

    // FormData 객체 생성: 파일 및 기타 데이터를 서버로 전송하기 위해 사용
    const formData = new FormData();
    // 이미지에서 확인된 대로, 파일의 Key는 'file'입니다.
    formData.append("file", selectedFile);

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        // FormData를 사용할 때는 'Content-Type': 'multipart/form-data' 헤더를
        // **명시적으로 설정하지 않아야** 브라우저가 boundary를 자동으로 설정합니다.
        body: formData,
      });

      // 서버 응답을 JSON으로 파싱
      const result: any = await response.json();
      if (!result?.success) {
        alert(`메모 데이터 가져오기 실패. ${result?.msg}`);
        return;
      }
      console.log(`# result: `, result);
      setPredict1(result?.predictions ?? []);
    } catch (err: any) {
      console.error("Upload Error:", err);
      // 'err'가 Error 인스턴스인지 확인하고 메시지를 설정
      setError(
        err instanceof Error
          ? err.message
          : "파일 업로드 중 알 수 없는 에러가 발생했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div>{componentTitle}</div>
      <hr />
      <div>
        <img width="300vw; height: auto;" src={imagePreviewUrl} />
      </div>
      <hr />
      <div>
        <input type="file" onChange={handleFileChange} />
      </div>
      <hr />
      <div>
        <button
          onClick={handleFileUpload}
          disabled={!selectedFile || isLoading}
        >
          {isLoading ? "⏳ 전송 중..." : "🖼️ 서버로 전송"}
        </button>
      </div>
      <hr />
      <div>
        {error && (
          <p style={{ color: "red", fontWeight: "bold" }}>🚨 에러: {error}</p>
        )}
      </div>
      <div>
        {predict1?.map((e) => (
          <div>{JSON.stringify(e)}</div>
        ))}
      </div>
    </div>
  );
}
