import express from "express";
const authRouter = express.Router();
import { register } from "../controllers/auth/register";
import { verifyRegistration } from "../controllers/auth/verifyReg";
import { login } from "../controllers/auth/login";
import { forgotPassword } from "../controllers/auth/forgot-password";
import { resetPassword } from "../controllers/auth/reset-password";
import { verifyUpdation } from "../controllers/auth/verifyUpdate";

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/verify-registration", verifyRegistration);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);
authRouter.post("/verify-updation", verifyUpdation);

export default authRouter;
