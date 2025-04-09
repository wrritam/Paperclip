import express from "express";
const router = express.Router();

import { runRequest } from "../controllers/runRequest";
import { authentication } from "../middleware/authenticator";

router.post("/run-request", runRequest);

export default router;
