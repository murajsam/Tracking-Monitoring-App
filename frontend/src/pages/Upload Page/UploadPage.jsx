import React from "react";
import Navbar from "../../components/Navbar";
import UploadFile from "./UploadFile";

const UploadPage = () => {
  return (
    <>
      <Navbar />
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-5xl font-bold text-gray-700 text-center mb-10">
          Upload Your Tracking Data
        </h1>
        <UploadFile />
      </div>
    </>
  );
};

export default UploadPage;
