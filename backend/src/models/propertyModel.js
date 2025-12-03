

import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  deposit: { type: Number },
  bhk: { type: String, required: true }, // e.g., "2BHK"
  city: { type: String, required: true },
  locality: { type: String, required: true },
  furnishing: { type: String, enum: ["Full", "Semi", "None"], default: "Semi" },
  images: [String], // array of URLs
  amenities: [String], // e.g., ["WiFi", "Parking"]
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

export default mongoose.model("Property", propertySchema);