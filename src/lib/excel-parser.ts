import * as xlsx from 'xlsx';

export interface ParsedClinic {
  name: string;
  url?: string;
  location?: string;
  industry: string;
  phone?: string;
}

export function parseExcelBuffer(buffer: ArrayBuffer): ParsedClinic[] {
  const workbook = xlsx.read(buffer, { type: 'array' });
  const clinics: ParsedClinic[] = [];

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    // Defval ensures empty cells are loaded as empty strings instead of missing keys
    const rows = xlsx.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' });

    for (const row of rows) {
      const keys = Object.keys(row);
      if (keys.length === 0) continue;

      // Smart Fuzzy Matcher for Headers
      const nameKey = keys.find(k => /client|cliente|name|nombre|empresa/i.test(k));
      const urlKey = keys.find(k => /url|web|link|dominio/i.test(k));
      const locKey = keys.find(k => /location|loc|ciudad|lugar|ubicacion/i.test(k));
      const phoneKey = keys.find(k => /telef|phone|movil/i.test(k));

      const nameRaw = nameKey ? row[nameKey] : row[keys[0]]; // Fallback to column 1 if no header matches
      const urlRaw = urlKey ? row[urlKey] : '';
      const locationRaw = locKey ? row[locKey] : '';
      const phoneRaw = phoneKey ? row[phoneKey] : '';

      const name = nameRaw ? nameRaw.toString().trim() : '';
      if (!name) continue; // Skip invalid rows entirely

      const url = urlRaw ? urlRaw.toString().trim() : undefined;
      const location = locationRaw ? locationRaw.toString().trim() : undefined;
      const phone = phoneRaw ? phoneRaw.toString().trim() : undefined;

      clinics.push({
        name,
        url,
        location,
        phone,
        industry: sheetName.trim() // Tab logic
      });
    }
  }

  return clinics;
}
