import express from "express";
const router = express.Router();

import { runRequest } from "../controllers/runRequest";
import { authentication } from "../middleware/authenticator";
import { deleteRequest } from "../controllers/deleteRequest";
import { groupedInsights } from "../controllers/getGroupedInsights";

console.log(groupedInsights);

router.post("/run-request", authentication, runRequest);
router.delete("/delete-request/:requestId", authentication, deleteRequest);
router.get("/all-insights", authentication, groupedInsights);

export default router;
