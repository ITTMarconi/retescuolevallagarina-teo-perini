// Utility functions for data processing

/**
 * Fix UTF-8 encoding issues (when UTF-8 is incorrectly interpreted as Latin-1)
 * @param str - The string to fix
 * @returns The corrected string
 */
export function fixEncoding(str: string | null | undefined): string {
  if (!str) return "";
  try {
    // Convert the string to bytes as if it was Latin-1, then decode as UTF-8
    const bytes = new TextEncoder().encode(str);
    const decoder = new TextDecoder("latin1");
    const latin1String = decoder.decode(bytes);
    const utf8Bytes = new Uint8Array(
      latin1String.split("").map((c) => c.charCodeAt(0))
    );
    return new TextDecoder("utf-8").decode(utf8Bytes);
  } catch (e) {
    // If conversion fails, return original string
    return str;
  }
}

/**
 * Recursively fix encoding in objects, arrays, and nested structures
 * @param obj - The object to fix
 * @returns The object with fixed encoding
 */
export function fixObjectEncoding(obj: any): any {
  if (typeof obj === "string") {
    return fixEncoding(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => fixObjectEncoding(item));
  }
  if (obj && typeof obj === "object") {
    const fixed: any = {};
    for (const [key, value] of Object.entries(obj)) {
      fixed[key] = fixObjectEncoding(value);
    }
    return fixed;
  }
  return obj;
}
