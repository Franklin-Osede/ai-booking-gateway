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
    // header: 1 reads the raw array of arrays
    const rows = xlsx.utils.sheet_to_json<any[]>(sheet, { header: 1, defval: '' });

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (!Array.isArray(row)) continue;

      // Get non-empty cells
      const cells = row.map(cell => cell.toString().trim()).filter(Boolean);
      if (cells.length === 0) continue;

      // Identify URL
      const urlRegex = /(https?:\/\/|www\.)[a-zA-Z0-9-]+\.[a-zA-Z]{2,}|[a-zA-Z0-9-]+\.(com|es|co|org|net)(\/.*)?$/i;
      const urlIndex = row.findIndex(cell => urlRegex.test(cell.toString().trim()));
      const urlRaw = urlIndex !== -1 ? row[urlIndex].toString().trim() : '';

      // Collect all other strings that are not the URL
      const otherStrings: string[] = [];
      for (let j = 0; j < row.length; j++) {
         const val = row[j].toString().trim();
         if (j !== urlIndex && val.length > 1 && !val.includes('@')) { 
            otherStrings.push(val);
         }
      }

      let nameRaw = '';
      let locationRaw = '';

      // Intelligent assignment based on available columns
      if (otherStrings.length === 1) {
         // If there's only one extra string, assume it's the location (e.g., "Sevilla", "Malaga")
         // as per the user's spreadsheet format
         locationRaw = otherStrings[0];
      } else if (otherStrings.length >= 2) {
         // If there are two strings, assume format like [Name, URL, Location]
         nameRaw = otherStrings[0];
         locationRaw = otherStrings[1];
      }

      // If no name found (because it's a 2-column spreadsheet URL+Location), extract from URL
      if (!nameRaw && urlRaw) {
         try {
           const u = new URL(urlRaw.startsWith('http') ? urlRaw : `https://${urlRaw}`);
           nameRaw = u.hostname.replace('www.', '').split('.')[0];
         } catch {
           nameRaw = urlRaw.replace(/https?:\/\/(www\.)?/, '').split('/')[0].replace('.com', '').replace('.es', '');
         }
         // Capitalize the URL name
         if (nameRaw) {
            nameRaw = nameRaw.charAt(0).toUpperCase() + nameRaw.slice(1);
         }
      }

      const name = nameRaw.trim();
      
      // Skip if it feels like a header row (e.g. name = "url" and url = "url")
      if (/^url|^web|^link|^cliente|^nombre|^client/i.test(name) || /^url|^web|^link|^cliente|^nombre|^client/i.test(locationRaw)) {
        if (urlRaw === '' || urlRaw.toLowerCase() === 'url') continue;
      }

      if (name || urlRaw) {
         clinics.push({
           name: name || "Clínica Desconocida",
           url: urlRaw || undefined,
           location: locationRaw || undefined,
           industry: sheetName.trim()
         });
      }
    }
  }

  // Remove duplicates by name/url
  const uniqueClinics: ParsedClinic[] = [];
  const seen = new Set();
  for (const c of clinics) {
     const id = (c.url || c.name).toLowerCase();
     if (!seen.has(id)) {
        seen.add(id);
        uniqueClinics.push(c);
     }
  }

  return uniqueClinics;
}
