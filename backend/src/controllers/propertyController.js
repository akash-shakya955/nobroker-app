

import Property from "../models/propertyModel.js";

export const addProperty = async (req, res) => {
  try {
    const property = await Property.create({
      ...req.body,
      owner: req.user._id
    });
    res.status(201).json({ message: "Property added successfully!", property });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProperties = async (req, res) => {
  try {
    const properties = await Property.find().populate("owner", "name phone email");
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};