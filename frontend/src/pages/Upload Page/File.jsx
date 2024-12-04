import React from "react";

const File = ({ name, status, columns, onRemove, showRemove }) => {
  return (
    <div className="bg-gray-100 border p-4 flex flex-col items-center justify-center relative">
      {/* Remove Button */}
      {showRemove && (
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
          title="Remove File"
        >
          [x]
        </button>
      )}

      {/* Excel Icon */}
      <div className="flex flex-col items-center">
        <img
          src="https://www.freeiconspng.com/uploads/excel-icon-12.png"
          alt="Excel Icon"
          className="h-28 w-28"
        />
      </div>

      {/* File Info */}
      <div className="mt-4 text-center">
        <p className="text-gray-700 font-semibold text-lg truncate">{name}</p>
        <p
          className={`text-md mt-1 ${
            status === "Checked"
              ? "text-green-500"
              : status === "Error"
              ? "text-red-500"
              : "text-gray-500"
          }`}
        >
          Status: {status}
        </p>
        {columns !== undefined && (
          <p className="text-md text-gray-600">Columns: {columns}</p>
        )}
      </div>
    </div>
  );
};

export default File;
