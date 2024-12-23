import React from "react";
import Navbar from "../../components/Navbar";
import UploadFile from "./UploadFile";
import Footer from "../../components/Footer";

const UploadPage = () => {
  return (
    <div className="min-h-screen w-full flex flex-col justify-between">
      <Navbar />
      <div className="w-full">
        <h1 className="text-5xl font-bold text-gray-700 text-center mb-5">
          Upload Your Tracking Data
        </h1>
        <UploadFile />
      </div>
      <Footer />
    </div>
  );
};

export default UploadPage;
