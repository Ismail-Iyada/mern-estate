import express from "express";
import {
  createListing,
  deleteListing,
  updateListing,
  getListing,
} from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyToken, createListing);
router.delete("/delete/:id", verifyToken, deleteListing);
router.post("/update/:id", verifyToken, updateListing);
// ! This route is not protected by verifyToken, 
// ! because we want to allow users 
// ! to view listings without being logged in. 
// * = public route for public users access
router.get("/get/:id", getListing);

export default router;
