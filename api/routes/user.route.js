import express from "express";
import { test } from "../controllers/user.controller.js";

// * use express to create the route
const router = express.Router();

router.get("/test", test);



export default router;