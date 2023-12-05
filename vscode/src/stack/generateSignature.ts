import * as CryptoJS from "crypto-js";

export function generateSignature(
  query: string,
  params: any,
  type: any,
  integration: string
): string {
  // Implement logic to generate a unique signature based on query, params, and type
  return `${query}-${JSON.stringify(params)}-${JSON.stringify(
    type
  )}-${integration}`;
}

export function createMD5HashFromSignature(signature: string): string {
  return CryptoJS.MD5(signature).toString();
}
