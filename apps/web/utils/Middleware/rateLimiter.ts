import { NextRequest } from "next/server";

// Simple in-memory store for rate limiting
class RateLimiterEdge {
  private store: Map<string, { points: number; resetTime: number }>;
  private points: number;
  private duration: number; // in seconds

  constructor(options: { points: number; duration: number }) {
    this.store = new Map();
    this.points = options.points;
    this.duration = options.duration;
  }

  async consume(key: string, pointsToConsume: number = 1): Promise<void> {
    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    const record = this.store.get(key);

    // If no record exists or the record has expired, create a new one
    if (!record || now >= record.resetTime) {
      this.store.set(key, {
        points: this.points - pointsToConsume,
        resetTime: now + this.duration,
      });
      return;
    }

    // If there are not enough points left, throw an error
    if (record.points < pointsToConsume) {
      throw new Error("Rate limit exceeded");
    }

    // Otherwise, consume points and update the record
    record.points -= pointsToConsume;
    return;
  }

  // Method to clean up expired records (call periodically if needed)
  cleanup(): void {
    const now = Math.floor(Date.now() / 1000);
    for (const [key, value] of this.store.entries()) {
      if (now >= value.resetTime) {
        this.store.delete(key);
      }
    }
  }
}

// Create the rate limiter
const rateLimiter = new RateLimiterEdge({
  points: 200, // Number of points
  duration: 10 * 60, // Duration in seconds (10 minutes)
});

// Define the rate limiting function
export async function rateLimit(
  req: NextRequest
): Promise<{ success: boolean; message?: string }> {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "anonymous";
  
  try {
    await rateLimiter.consume(ip, 1);
    return { success: true };
  } catch (e) {
    return {
      success: false,
      message: "Too many requests from this IP, please try again later.",
    };
  }
}