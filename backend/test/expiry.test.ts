import { describe, it, expect } from "vitest";
import { expireStaleReservations } from "../src/services/reservationExpirationJob";

describe("expireStaleReservations", () => {
  it("returns an object with expiredCount as a number", () => {
    const result = expireStaleReservations();
    expect(typeof result).toBe("object");
    expect(typeof result.expiredCount).toBe("number");
    expect(result.expiredCount).toBeGreaterThanOrEqual(0);
  });
});
