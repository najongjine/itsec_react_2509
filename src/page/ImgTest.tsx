import { useEffect, useState } from "react";

export default function ImgTest() {
  // 선택된 이미지 파일의 URL을 저장할 state
  const [imagePreviewUrl, setImagePreviewUrl] = useState<any>(null);
  // 선택된 실제 파일 객체를 저장할 state (필요시 사용)
  const [imageFile, setImageFile] = useState<any>(null);

  useEffect(() => {}, []);

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

  return (
    <div className="content-margin-padding">
      <div>img test</div>
      <h2>📥 이미지 파일 미리보기</h2>

      {/* 1. 파일 입력 필드 */}
      <input
        type="file"
        accept="image/*" // 이미지 파일만 선택 가능하도록 설정
        onChange={handleImageChange}
        style={{ marginBottom: "20px" }}
      />
    </div>
  );
}
