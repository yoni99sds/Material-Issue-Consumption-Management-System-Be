import mongoose from "mongoose";

const consumptionSchema = new mongoose.Schema(
  {
    itemCode: String,
    description: String,
    UOM: String,
    issuedQty: Number,
    returnedQty: Number,
    wasteQty: Number,
    remark: String,
    date: String,
  },
  { timestamps: true }
);

export default mongoose.model("Consumption", consumptionSchema);