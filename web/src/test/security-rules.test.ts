import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

describe("Firestore Security Rules Specification", () => {
  const rulesPath = path.resolve(__dirname, "../../../firestore.rules");
  const rulesContent = fs.readFileSync(rulesPath, "utf-8");

  it("deve existir o arquivo firestore.rules", () => {
    expect(fs.existsSync(rulesPath)).toBe(true);
  });

  it("deve bloquear acesso por padrao com match /{document=**}", () => {
    expect(rulesContent).toContain("match /{document=**}");
    expect(rulesContent).toContain("allow read, write: if false;");
  });

  it("deve exigir autenticacao e isolamento de userId para conexoes", () => {
    expect(rulesContent).toContain("match /connections/{connectionId}");
    expect(rulesContent).toContain("request.auth != null");
    expect(rulesContent).toContain("resource.data.userId == request.auth.uid");
    expect(rulesContent).toContain("request.resource.data.userId == request.auth.uid");
  });

  it("deve exigir autenticacao e isolamento de userId para contatos", () => {
    expect(rulesContent).toContain("match /contacts/{contactId}");
    expect(rulesContent).toContain("resource.data.userId == request.auth.uid");
    expect(rulesContent).toContain("request.resource.data.userId == request.auth.uid");
  });

  it("deve exigir autenticacao e isolamento de userId para mensagens", () => {
    expect(rulesContent).toContain("match /messages/{messageId}");
    expect(rulesContent).toContain("resource.data.userId == request.auth.uid");
    expect(rulesContent).toContain("request.resource.data.userId == request.auth.uid");
    expect(rulesContent).toContain('request.resource.data.status in ["sent", "scheduled"]');
  });

  it("nao deve conter regras publicas ou abertas irrestritamente", () => {
    expect(rulesContent).not.toMatch(/allow\s+(read|write|create|update|delete)\s*:\s*if\s+true\s*;/);
  });
});
