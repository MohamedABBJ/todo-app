import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { RateLimitOptions } from "./interfaces";

// Simple in-memory store for rate limiting
const rateLimit = new Map<string, { count: number; lastReset: number }>();

export function getRateLimitMiddleware(options: RateLimitOptions) {
  const { limit, windowMs } = options;

  // Middleware function to check and enforce rate limits
  return async function rateLimitMiddleware(request: NextRequest) {
    const ip = request.ip || "anonymous";
    const now = Date.now();

    // Get or initialize rate limit data for this IP
    const rateLimitData = rateLimit.get(ip) || { count: 0, lastReset: now };

    // Reset count if window has passed
    if (now - rateLimitData.lastReset > windowMs) {
      rateLimitData.count = 0;
      rateLimitData.lastReset = now;
    }

    rateLimitData.count++;
    rateLimit.set(ip, rateLimitData);

    // If limit exceeded, return 429 response
    if (rateLimitData.count > limit) {
      return NextResponse.json(
        { error: "Too many requests, please try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(Math.ceil(windowMs / 1000)) },
        }
      );
    }

    return null;
  };
}

// Predefined rate limiters for different endpoints
export const authRateLimiter = getRateLimitMiddleware({
  limit: 5,
  windowMs: 60 * 1000,
}); // 5 requests per minute

export const taskRateLimiter = getRateLimitMiddleware({
  limit: 20,
  windowMs: 60 * 1000,
}); // 20 requests per minute
