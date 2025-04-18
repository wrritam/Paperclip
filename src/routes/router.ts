import express from "express";
const router = express.Router();

import { rateLimiterforAPIs } from "../middleware/rateLimiter";
import { runRequest } from "../controllers/runRequest";
import { authentication } from "../middleware/authenticator";
import { deleteRequest } from "../controllers/deleteRequest";
import { allInsights } from "../controllers/getGroupedInsights";
import { searchLogs } from "../controllers/searchLogs";

router.use(rateLimiterforAPIs);
router.post("/run-request", authentication, runRequest);
router.delete("/delete-request/:requestId", authentication, deleteRequest);
router.get("/all-insights", authentication, allInsights);
router.get("/search-logs", authentication, searchLogs);

export default router;
