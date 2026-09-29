/**
 * Aplica mascara de telefone celular brasileiro no formato (11) 98765-4321
 * Suporta tanto telefones de 10 digitos (11) 8765-4321 quanto de 11 digitos (11) 98765-4321
 */
export function formatPhoneNumber(value: string | null | undefined): string {
  if (!value) return "";

  // Remove tudo que nao for digito
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length === 0) return "";
  if (digits.length <= 2) {
    return `(${digits}`;
  }
  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }
  if (digits.length <= 10) {
    // Fixo / 8 digitos
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  // Celular / 9 digitos
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

/**
 * Remove a mascara e retorna apenas os numeros
 */
export function unformatPhoneNumber(value: string | null | undefined): string {
  if (!value) return "";
  return value.replace(/\D/g, "");
}
