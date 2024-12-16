import mongoose from "mongoose";

const trackingSchema = new mongoose.Schema(
  {
    data: {
      type: {
        Status: { type: String },
        "PO Number": { type: String },
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
        "House AWB": { type: String },
        "Shipper Ref. No": { type: String },
        Carrier: { type: String },
        "Inco Term": { type: String },
        "Flight No": { type: String },
        "Pick-up Date": { type: Date },
        "Latest Checkpoint": { type: Date },
        "Additional Info": { type: mongoose.Schema.Types.Mixed },
      },
    },
    fileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
    },
    dateAdded: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false }
);

export default mongoose.model("Tracking", trackingSchema);
