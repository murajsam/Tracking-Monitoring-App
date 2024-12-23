import React, { useState } from "react";
import File from "./File";
import axios from "axios";
import LoadingSpinner from "../../components/LoadingSpinner";

const UploadFile = () => {
  const [step, setStep] = useState(1);
  const [files, setFiles] = useState([]);
  const [validationResults, setValidationResults] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);

  // File selection and validation helpers
  const validateFiles = (selectedFiles) => {
    const validFiles = selectedFiles.filter((file) =>
      ["xls", "xlsx"].includes(file.name.split(".").pop().toLowerCase())
    );
    const invalidFiles = selectedFiles.length - validFiles.length;

    if (invalidFiles > 0) {
      setErrorMessage("Supported file formats: .xlsx, .xls");
      setTimeout(() => setErrorMessage(""), 3000);
    }

    return validFiles.map((file) => ({
      name: file.name,
      file,
      status: "N/A",
      carrier: null,
      totalRows: 0,
      duplicatedRows: 0,
      importedRows: 0,
      successRate: 0,
    }));
  };

  // File input handlers
  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const newFiles = validateFiles(selectedFiles);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const selectedFiles = Array.from(event.dataTransfer.files);
    const newFiles = validateFiles(selectedFiles);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleValidation = async () => {
    setIsLoading(true);
    setProgress(0);
    setCurrentFileIndex(0);
    try {
      const responses = [];
      let i = 0;

      for (const file of files) {
        setCurrentFileIndex(i);
        const formData = new FormData();
        formData.append("file", file.file);

        try {
          const response = await axios.post(
            "http://localhost:5000/api/files/upload", // Adjust your backend URL
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (response.status === 200) {
            const fileData = response.data.file || response.data;
            responses.push({
              ...file,
              ...fileData,
              status: fileData.importedRows > 0 ? "Validated" : "Failed",
              carrier: fileData.carrier || "Unknown",
              error: fileData.failureReason, // Added failure reason
            });
          }
        } catch (error) {
          console.error(`Validation error for ${file.name}:`, error);
          responses.push({
            ...file,
            status: "Failed",
            error: error.response?.data?.message || "Unknown error",
          });
        } finally {
          i++;
          setProgress(Math.round((i / files.length) * 100));
        }
      }

      setValidationResults(responses);
      setFiles(responses);
      setStep(3);
    } catch (error) {
      console.error("Validation failed:", error);
      setErrorMessage("Validation failed. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset method
  const resetUpload = () => {
    setStep(1);
    setFiles([]);
    setValidationResults([]);
    setErrorMessage("");
  };

  // Render methods
  const renderFileUploadStep = () => (
    <div className="text-center">
      {files.length === 0 ? (
        <div
          className={`flex flex-col items-center justify-center mb-6 min-h-96 border-dashed border-2 rounded-lg ${
            isDragging ? "border-green-500" : "border-gray-300"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={() => document.getElementById("file-upload").click()}
          >
            <div className="bg-green-100 rounded-full p-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-20 w-20 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 15a4 4 0 004 4h10a4 4 0 004-4M7 10l5-5m0 0l5 5m-5-5v12"
                />
              </svg>
            </div>
            <p className="text-green-800 font-semibold text-md mt-4">
              Drag & Drop files here or click to upload (.xlsx, .xls)
            </p>
          </div>
          <input
            type="file"
            multiple
            accept=".xls,.xlsx"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 min-h-96">
          {files.map((file, index) => (
            <File
              key={index}
              name={file.name}
              status={file.status}
              onRemove={() => handleRemoveFile(index)}
              showRemove={step === 1}
              step={step}
            />
          ))}
        </div>
      )}
      {files.length > 0 && (
        <>
          <button
            onClick={() => setStep(2)}
            className="mt-6 bg-green-500 text-white font-bold py-3 px-16 rounded hover:bg-green-600 float-end"
          >
            Next
          </button>
          <button
            onClick={() => document.getElementById("file-upload").click()}
            className="mt-6 mr-5 bg-green-500 text-white font-bold py-3 px-16 rounded hover:bg-green-600 float-end"
          >
            Upload more?
          </button>
          <input
            type="file"
            multiple
            accept=".xls,.xlsx"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
        </>
      )}
    </div>
  );

  return (
    <div className="flex flex-col items-center bg-gray-100 w-full p-6">
      <div className="bg-white border-2 rounded-3xl p-6 max-w-7xl w-full shadow-lg">
        <h2 className="text-3xl font-bold text-gray-700 text-center mb-6">
          <span className="text-green-500">
            {step <= 2 ? `Step ${step} - ` : `Finished`}
          </span>
          {["Upload Files", "Validate Files & Import Data"][step - 1]}
        </h2>

        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-16">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl transition-colors ${
                  step >= s
                    ? "bg-green-500 text-white scale-110"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`h-1 flex-1 mx-2 ${
                    step > s ? "bg-green-500" : "bg-gray-300"
                  }`}
                ></div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-100 text-red-700 font-bold p-3 rounded mb-4 text-center">
            {errorMessage}
          </div>
        )}

        {/* Render different steps */}
        {step === 1 && renderFileUploadStep()}

        {step === 2 && (
          <>
            {isLoading ? (
              <LoadingSpinner
                progress={progress}
                currentFile={currentFileIndex + 1}
                totalFiles={files.length}
              />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 min-h-96">
                  {files.map((file, index) => (
                    <File
                      key={index}
                      name={file.name}
                      status={file.status}
                      showRemove={false}
                      step={step}
                    />
                  ))}
                </div>
                <button
                  onClick={handleValidation}
                  className="mt-6 bg-green-500 text-white font-bold py-3 px-16 rounded hover:bg-green-600 float-end"
                >
                  Import data
                </button>
              </>
            )}
          </>
        )}

        {step === 3 && (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 min-h-96">
              {validationResults.map((file, index) => (
                <File
                  key={index}
                  name={file.name}
                  status={file.status}
                  carrier={file.carrier}
                  totalRows={file.totalRows}
                  importedRows={file.importedRows}
                  duplicatedRows={file.duplicatedRows}
                  successRate={file.successRate}
                  error={file.error}
                  showRemove={false}
                  step={step}
                />
              ))}
            </div>
            <button
              onClick={() => {
                resetUpload();
              }}
              className="mt-6 bg-gray-500 text-white font-bold py-3 px-10 rounded hover:bg-gray-600"
            >
              ← Upload more
            </button>

            <a
              href="/overview"
              className="mt-6 bg-green-500 text-white font-bold py-3 px-16 rounded hover:bg-green-600 float-end"
            >
              Overview →
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadFile;
