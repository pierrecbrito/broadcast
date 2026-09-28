import { describe, it, expect } from "vitest";
import { app, auth, db } from "./firebase";

describe("firebase configuration", () => {
  it("deve exportar as instancias do app, auth e db", () => {
    expect(app).toBeDefined();
    expect(auth).toBeDefined();
    expect(db).toBeDefined();
  });
});
