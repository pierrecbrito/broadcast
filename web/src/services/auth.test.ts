import { describe, it, expect, vi, beforeEach } from "vitest";
import * as authService from "./auth";
import * as firebaseAuth from "firebase/auth";

vi.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  getAuth: vi.fn(),
}));

vi.mock("../lib/firebase", () => ({
  auth: { currentUser: null },
}));

describe("auth service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve chamar createUserWithEmailAndPassword ao executar signUp", async () => {
    const mockCredential = { user: { uid: "user-123" } } as unknown as firebaseAuth.UserCredential;
    vi.mocked(firebaseAuth.createUserWithEmailAndPassword).mockResolvedValueOnce(mockCredential);

    const result = await authService.signUp("test@example.com", "password123");

    expect(firebaseAuth.createUserWithEmailAndPassword).toHaveBeenCalledWith(
      expect.anything(),
      "test@example.com",
      "password123"
    );
    expect(result).toBe(mockCredential);
  });

  it("deve chamar signInWithEmailAndPassword ao executar signIn", async () => {
    const mockCredential = { user: { uid: "user-123" } } as unknown as firebaseAuth.UserCredential;
    vi.mocked(firebaseAuth.signInWithEmailAndPassword).mockResolvedValueOnce(mockCredential);

    const result = await authService.signIn("test@example.com", "password123");

    expect(firebaseAuth.signInWithEmailAndPassword).toHaveBeenCalledWith(
      expect.anything(),
      "test@example.com",
      "password123"
    );
    expect(result).toBe(mockCredential);
  });

  it("deve chamar signOut ao deslogar", async () => {
    vi.mocked(firebaseAuth.signOut).mockResolvedValueOnce();

    await authService.signOut();

    expect(firebaseAuth.signOut).toHaveBeenCalledWith(expect.anything());
  });
});
