import { describe, it, expect } from "vitest";
import { formatPhoneNumber, unformatPhoneNumber } from "./phone";

describe("phone utility", () => {
  it("deve formatar celular de 11 digitos corretamente", () => {
    expect(formatPhoneNumber("11987654321")).toBe("(11) 98765-4321");
  });

  it("deve formatar telefone de 10 digitos corretamente", () => {
    expect(formatPhoneNumber("1187654321")).toBe("(11) 8765-4321");
  });

  it("deve lidar com valores parciais progressivos", () => {
    expect(formatPhoneNumber("1")).toBe("(1");
    expect(formatPhoneNumber("11")).toBe("(11");
    expect(formatPhoneNumber("119")).toBe("(11) 9");
    expect(formatPhoneNumber("1198765")).toBe("(11) 9876-5");
  });

  it("deve remover caracteres nao numericos ao formatar", () => {
    expect(formatPhoneNumber("(11) 9.8765-4321")).toBe("(11) 98765-4321");
  });

  it("deve retornar vazio se o valor for nulo ou vazio", () => {
    expect(formatPhoneNumber("")).toBe("");
    expect(formatPhoneNumber(null)).toBe("");
    expect(formatPhoneNumber(undefined)).toBe("");
  });

  it("unformatPhoneNumber deve extrair apenas os digitos", () => {
    expect(unformatPhoneNumber("(11) 98765-4321")).toBe("11987654321");
    expect(unformatPhoneNumber("abc 123")).toBe("123");
    expect(unformatPhoneNumber("")).toBe("");
  });
});
