import React, { useState } from "react";

const UploadFile = () => {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [validationMessage, setValidationMessage] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const fileExtension = selectedFile.name.split(".").pop().toLowerCase();
      if (fileExtension === "xls" || fileExtension === "xlsx") {
        setFile(selectedFile);
        setValidationMessage("");
      } else {
        setFile(null);
        setValidationMessage(
          "Invalid file format. Please upload .xls or .xlsx files."
        );
      }
    }
  };

  const handleNextStep = () => {
    if (step < 5) {
      setStep(step + 1);
    }
  };

  const handleStartOver = () => {
    setStep(1);
    setFile(null);
    setValidationMessage("");
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white border-2 rounded-3xl p-6 max-w-5xl w-full">
        <h1 className="text-2xl font-bold text-gray-700 text-center mb-6">
          Step {step}
        </h1>

        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-6">
          {[1, 2, 3, 4, 5].map((s) => (
            <React.Fragment key={s}>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= s
                    ? "bg-green-500 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                {s}
              </div>
              {s < 5 && (
                <div
                  className={`h-1 flex-1 mx-2 ${
                    step > s ? "bg-green-500" : "bg-gray-300"
                  }`}
                ></div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Content for Each Step */}
        {step === 1 && (
          <div>
            <p className="text-gray-600 mb-4">
              Step 1: Choose a file to upload
            </p>
            <div className="relative">
              <input
                type="file"
                accept=".xls,.xlsx"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="block w-full bg-green-500 text-white font-bold py-2 px-4 rounded text-center cursor-pointer hover:bg-green-600"
              >
                Choose File
              </label>
              {file && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected File: {file.name}
                </p>
              )}
            </div>
            {validationMessage && (
              <p className="text-red-500 text-sm mt-4">{validationMessage}</p>
            )}
            <button
              onClick={handleNextStep}
              disabled={!file}
              className={`mt-6 w-full bg-green-500 text-white font-bold py-2 px-4 rounded ${
                file ? "hover:bg-green-600" : "opacity-50 cursor-not-allowed"
              }`}
            >
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <p className="text-gray-600 mb-4">Step 2: File Validation</p>
            <p className="text-green-600">File validated successfully!</p>
            <button
              onClick={handleNextStep}
              className="mt-6 w-full bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600"
            >
              Next
            </button>
          </div>
        )}

        {step === 3 && (
          <div>
            <p className="text-gray-600 mb-4">Step 3: Mapping Fields</p>
            <p className="text-gray-600">Field mapping is in progress...</p>
            <button
              onClick={handleNextStep}
              className="mt-6 w-full bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600"
            >
              Next
            </button>
          </div>
        )}

        {step === 4 && (
          <div>
            <p className="text-gray-600 mb-4">Step 4: Review Summary</p>
            <button
              onClick={handleNextStep}
              className="mt-6 w-full bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600"
            >
              Next
            </button>
          </div>
        )}

        {step === 5 && (
          <div>
            <p className="text-green-600 font-bold mb-4">
              File uploaded successfully!
            </p>
            <button
              onClick={handleStartOver}
              className="w-full bg-gray-500 text-white font-bold py-2 px-4 rounded hover:bg-gray-600"
            >
              Start Over
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadFile;
