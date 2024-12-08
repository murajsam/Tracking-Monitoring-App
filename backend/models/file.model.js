import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  carrier: {
    type: String,
    enum: ["Logwin", "DHL", "Hellman", null],
    default: null,
  },
  status: {
    type: String,
    enum: ["N/A", "Validated", "Failed"],
    default: "N/A",
  },
  importedRows: {
    type: Number,
    default: 0,
  },
  totalRows: {
    type: Number,
    default: 0,
  },
  successRate: {
    type: Number,
    default: 0,
  },
});

fileSchema.methods.calculateSuccessRate = function () {
  if (this.totalRows > 0) {
    this.successRate = ((this.importedRows / this.totalRows) * 100).toFixed(2);
  } else {
    this.successRate = 0;
  }
};

export default mongoose.model("File", fileSchema);