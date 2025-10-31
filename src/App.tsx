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

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/memo_detail" element={<MemoDetail />} />
          <Route path="/memo_upsert" element={<MemoUpsert />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/calc" element={<Calc />} />
          <Route path="/lotto" element={<Lotto />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
