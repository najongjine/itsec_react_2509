import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Img_Response_Compo from "../component/cnn/Img_Response_Compo";
import * as ai_urls from "../utils/ai_server_urls";

export default function ImgTest() {
  // 1. URL의 쿼리 파라미터를 읽습니다.
  const [searchParams] = useSearchParams();
  // 'model' 파라미터의 값을 가져옵니다.
  const modelType = searchParams.get("model") ?? "base";

  return (
    <div className="content-margin-padding">
      {modelType == "base" && (
        <Img_Response_Compo
          apiUrl={ai_urls.basic_effinet_ai_url}
          componentTitle="EfficentNetB0 기본 모델"
        />
      )}

      {modelType == "muffin_chihuahua" && (
        <Img_Response_Compo
          apiUrl={ai_urls.chihuahua_muffic_ai_url}
          componentTitle="머핀 vs 치와와 파인튜닝 모델"
        />
      )}

      {modelType == "plantdisease" && (
        <Img_Response_Compo
          apiUrl={ai_urls.plantdisease_ai_url}
          componentTitle="식물 잎사귀 병판단 모델"
        />
      )}
    </div>
  );
}
