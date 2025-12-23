import express from "express";
import multer from "multer";
import path from "path";
import { auth } from "../middleware/authMiddleware.js";
import Property from "../models/propertyModel.js";

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// GET all properties
router.get("/", async (req, res) => {
  try {
    const properties = await Property.find().populate("owner", "name phone email");
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single property by ID
router.get("/:id", async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate("owner", "name phone email");
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.json(property);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// POST - Add property with multiple images
router.post("/", auth, upload.array("images", 10), async (req, res) => {
  try {
    const { title, price, bhk, city, locality } = req.body;
    const images = req.files ? req.files.map(file => file.filename) : [];

    const property = new Property({
      title,
      price,
      bhk,
      city,
      locality,
      images,
      owner: req.user._id,
    });

    await property.save();
    await property.populate("owner", "name phone email");
    res.json(property);
  } catch (err) {
    console.error("PROPERTY ADD ERROR:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// PUT - Update property (Edit)
router.put("/:id", auth, upload.array("images", 10), async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });
    if (property.owner.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Not authorized" });

    const { title, price, bhk, city, locality } = req.body;

    property.title = title || property.title;
    property.price = price || property.price;
    property.bhk = bhk || property.bhk;
    property.city = city || property.city;
    property.locality = locality || property.locality;

    // Add new images if uploaded
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => file.filename);
      property.images = [...property.images, ...newImages];
    }

    await property.save();
    await property.populate("owner", "name phone email");
    res.json(property);
  } catch (err) {
    console.error("PROPERTY UPDATE ERROR:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// DELETE - Delete property
router.delete("/:id", auth, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });
    if (property.owner.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Not authorized" });

    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: "Property deleted successfully" });
  } catch (err) {
    console.error("PROPERTY DELETE ERROR:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;