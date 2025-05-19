import express from "express";
import { customerRole } from "../../middleware/CustomerRole.middleware.js";
import { customerProfile } from "../../controllers/CustomerProfile.controller.js";

export let customerRoutes = express.Router();

// me
customerRoutes.get("/", customerRole, customerProfile);
