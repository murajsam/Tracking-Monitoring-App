import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UploadPage from "./pages/Upload Page/UploadPage";
import OverviewPage from "./pages/Overview Page/OverviewPage";
import DetailPage from "./pages/Detail Page/DetailPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/Overview Page" element={<OverviewPage />} />
        <Route path="/Detail Page" element={<DetailPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
