import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const DetailPage = () => {
  const { id } = useParams(); // Dohvata :id iz URL-a

  return (
    <div className="min-h-screen w-full flex flex-col justify-between">
      <Navbar />
      <div className="w-full flex flex-col justify-center items-center mt-10">
        <h1 className="text-5xl font-bold text-gray-700 text-center mb-5">
          Details Page
        </h1>
        <p className="text-2xl ">Selected ID: {id}</p>
      </div>
      <Footer />
    </div>
  );
};

export default DetailPage;
