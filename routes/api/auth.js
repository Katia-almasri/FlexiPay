import express from "express";
import {
  registerUser,
  login,
} from "../../controllers/auth/UserAuth.controller.js";
import { loginSchema } from "../../validations/auth/Login.validation.js";
import { validation } from "../../middleware/Validation.middleware.js";

export let authRoutes = express.Router();

// register
authRoutes.post("/register", registerUser);

//login
authRoutes.post("/login", validation(loginSchema), login);
