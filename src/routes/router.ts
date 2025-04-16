import express from "express";
const router = express.Router();

import { runRequest } from "../controllers/runRequest";
import { authentication } from "../middleware/authenticator";
import { deleteRequest } from "../controllers/deleteRequest";
import { allInsights } from "../controllers/getGroupedInsights";

router.post("/run-request", authentication, runRequest);
router.delete("/delete-request/:requestId", authentication, deleteRequest);
router.get("/all-insights", authentication, allInsights);

export default router;
