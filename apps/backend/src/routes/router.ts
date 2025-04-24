import express from "express";
const router = express.Router();

import { rateLimiterforAPIs } from "../middleware/rateLimiter";
import {
  validateRunRequest,
  validateSearchLogs,
  validateDeleteRequest,
  validateAllInsights,
} from "../middleware/requestValidator";
import { runRequest } from "../controllers/runRequest";
import { authentication } from "../middleware/authenticator";
import { deleteRequest } from "../controllers/deleteRequest";
import { allInsights } from "../controllers/getGroupedInsights";
import { searchLogs } from "../controllers/searchLogs";

router.use(rateLimiterforAPIs);
router.post("/run-request", authentication, validateRunRequest, runRequest);
router.delete(
  "/delete-request/:requestId",
  authentication,
  validateDeleteRequest,
  deleteRequest
);
router.get("/search-logs", authentication, validateSearchLogs, searchLogs);
router.get("/all-insights", validateAllInsights, authentication, allInsights);

export default router;
