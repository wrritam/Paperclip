import express from "express";
const router = express.Router();

import { rateLimiterforAPIs } from "../services/rate-limiter";
import {
  validateRunRequest,
  validateSearchLogs,
  validateDeleteRequest,
  validateAllInsights,
} from "../middleware/request-validator";
import { runRequest } from "../controllers/main/run-request";
import { authentication } from "../middleware/authenticator";
import { deleteRequest } from "../controllers/main/delete-request";
import { allInsights } from "../controllers/main/get-grouped-insights";
import { searchLogs } from "../controllers/main/search-logs";

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
