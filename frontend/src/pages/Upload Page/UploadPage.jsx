import React from "react";
import Navbar from "../../components/Navbar";
import UploadFile from "./UploadFile";

const UploadPage = () => {
  return (
    <>
      <Navbar />
      <h1 className="text-5xl font-bold text-gray-700 text-center mb-10">
        Upload Your Tracking Data
      </h1>
      <div className="">
        <UploadFile />
      </div>
    </>
  );
};

export default UploadPage;
