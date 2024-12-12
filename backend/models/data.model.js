import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
  Status: { type: String },
  "PO Number": { type: String},
  ETD: { type: Date },
  ETA: { type: Date },
  ATD: { type: Date },
  ATA: { type: Date },
  Packages: { type: Number },
  Weight: { type: Number },
  Volume: { type: Number },
  Shipper: { type: String },
  "Shipper Country": { type: String },
  Receiver: { type: String },
  "Receiver Country": { type: String },
  "House AWB": { type: String, required: true,  },
  "Shipper Ref. No": { type: String },
  Carrier: { type: String },
  "Inco Term": { type: String },
  "Flight No": { type: String },
  "Pick-up Date": { type: Date },
  "Latest Checkpoint": { type: Date },
  fileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File',
    required: true,
  },
});

export default mongoose.model("Data", dataSchema);
