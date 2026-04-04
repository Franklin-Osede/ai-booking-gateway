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

      // Find the first string that is NOT the URL, to be the Name
      let nameRaw = '';
      for (let j = 0; j < row.length; j++) {
         const val = row[j].toString().trim();
         if (j !== urlIndex && val.length > 1 && !val.includes('@')) { 
            nameRaw = val;
            break;
         }
      }

      // If no name found (like in column A being empty), extract from URL
      if (!nameRaw && urlRaw) {
         try {
           const u = new URL(urlRaw.startsWith('http') ? urlRaw : `https://${urlRaw}`);
           nameRaw = u.hostname.replace('www.', '').split('.')[0];
         } catch {
           nameRaw = urlRaw.replace(/https?:\/\/(www\.)?/, '').split('/')[0].replace('.com', '').replace('.es', '');
         }
      }

      const name = nameRaw.trim();
      
      // Skip if it feels like a header row (e.g. name = "url" and url = "url")
      if (/^url|^web|^link|^cliente|^nombre/i.test(name) && urlRaw === '') continue;

      if (name || urlRaw) {
         clinics.push({
           name: name || "Clínica Desconocida",
           url: urlRaw || undefined,
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
