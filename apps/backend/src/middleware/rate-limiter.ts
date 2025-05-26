import rateLimit from "express-rate-limit";

export const rateLimiterforAPIs = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: {
    error: "Too many requests, please try again later.",
    waitTime: "15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const rateLimiterforAuth = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    error: "Too many login attempts, please try again later.",
    waitTime: "15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
