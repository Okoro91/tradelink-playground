import { Request, Response } from "express";
import User from "../models/User.js";
import Seller from "../models/Seller.js";

export const registerSeller = async (req: Request, res: Response) => {
  const {
    storeName,
    description,
    location,
    phone,
    email,
    name,
    password,
    address,
    coordinates,
  } = req.body;

  try {
    if (!userId || !storeName || !location || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingSeller = await User.findOne({ email });
    if (existingSeller) {
      return res.status(400).json({ message: "Seller already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      address,
      role: "seller",
    });

    const seller = await Seller.create({
      userId: user._id,
      storeName,
      description,
      location: {
        address,
        coordinates,
      },
      phone,
      email,
    });

    if (user && seller) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        sellerId: seller._id,
        message: "Seller account registered successfully!",
      });
    } else {
      res.status(400).json({ message: "Invalid seller data" });
    }
  } catch (error) {
    console.error("Error in seller registration:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
