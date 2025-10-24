import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./component/Header";
import Home from "./page/Home";
import Footer from "./component/Footer";
import MemoDetail from "./page/MemoDetail";
import MemoUpsert from "./page/MemoUpsert";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/memo_detail" element={<MemoDetail />} />
          <Route path="/memo_upsert" element={<MemoUpsert />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
