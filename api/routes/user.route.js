import express from "express";
import {
  deleteUser,
  test,
  updateUser,
  getUserListings,
  getUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

// * use express to create the route
const router = express.Router();

router.get("/test", test);
// :id is a route parameter that represents the user's id, we can access it using req.params.id in the updateUser route handler.
// ? we can pass other route parameters in the URL and access them in the route handler using req.params. like so: /update/:id/:name
router.post("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/listings/:id", verifyToken, getUserListings);
router.get(`/:id`, verifyToken, getUser);
export default router;
