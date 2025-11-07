import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./component/Header";
import Home from "./page/Home";
import Footer from "./component/Footer";
import MemoDetail from "./page/MemoDetail";
import MemoUpsert from "./page/MemoUpsert";
import LoginPage from "./page/LoginPage";
import Calc from "./page/Calc";
import Lotto from "./page/Lotto";
import ImgTest from "./page/ImgTest";
import MyEditor from "./page/MyEditor";
import MemoDetailV2 from "./page/MemoDetailV2";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/memo_detail" element={<MemoDetailV2 />} />
          <Route path="/memo_upsert" element={<MyEditor />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/calc" element={<Calc />} />
          <Route path="/lotto" element={<Lotto />} />
          <Route path="/test" element={<ImgTest />} />
          <Route path="/editor" element={<MyEditor />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
