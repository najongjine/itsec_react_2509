import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BasicEffiModelCompo from "../component/cnn/BasicEffiModelCompo";

export default function ImgTest() {
  // 1. URL의 쿼리 파라미터를 읽습니다.
  const [searchParams] = useSearchParams();
  // 'model' 파라미터의 값을 가져옵니다.
  const modelType = searchParams.get("model");

  return (
    <div className="content-margin-padding">
      {modelType == "base" && <BasicEffiModelCompo />}
    </div>
  );
}
