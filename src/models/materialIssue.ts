import mongoose, { Schema, Document } from "mongoose";

export interface MaterialIssueHeader {
  date: string;
  machine: string;
  workOrderNo: string;
  jobDescription?: string | null;
  shift: string;
  operator: string;
  status: "pending" | "approved" | "rejected";
}

export interface MaterialIssueRow {
  sn: number;
  description: string;
  rollNo: string;
  width: number;
  weight: number;
  issuedLength: number;
  waste: number;
  actualSheetProduced: number;
  sheetSize: string;
}

export interface MaterialIssueDocument extends Document {
  header: MaterialIssueHeader;
  rows: MaterialIssueRow[];
  createdAt: Date;
  updatedAt: Date;
}

const materialIssueSchema = new Schema<MaterialIssueDocument>(
  {
    header: {
      date: String,
      machine: String,
      workOrderNo: String,
      jobDescription: String,
      shift: String,
      operator: String,
      status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
      },
    },
    rows: [
      {
        sn: Number,
        description: String,
        rollNo: String,
        width: Number,
        weight: Number,
        issuedLength: Number,
        waste: Number,
        actualSheetProduced: Number,
        sheetSize: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<MaterialIssueDocument>(
  "MaterialIssue",
  materialIssueSchema
);