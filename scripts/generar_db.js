const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, 'leads_procesados_final.csv');
const dbPath = path.join(__dirname, '../src/app/demo/clinics_db.json');

const csv = fs.readFileSync(csvPath, 'utf-8');
const lines = csv.split('\n').map(l => l.trim()).filter(l => l);

const database = {};

lines.slice(1).forEach(l => {
  const parts = l.split(',');
  if (parts.length >= 3) {
    const originalUrl = parts[1].trim();
    if (originalUrl) {
      let slug = '';
      try {
        const urlObj = new URL(originalUrl);
        slug = urlObj.hostname.replace('www.', '').split('.')[0].substring(0, 30);
      } catch (e) {
        // Fallback or ignore
      }
      
      const colorRaw = parts[parts.length - 1].trim();
      let colorFinal = colorRaw;
      if (!colorFinal.startsWith('#')) {
          colorFinal = '#' + colorFinal;
      }

      if (slug) {
        database[slug] = { url: originalUrl, color: colorFinal };
      }
    }
  }
});

fs.writeFileSync(dbPath, JSON.stringify(database, null, 2));
console.log('✅ Base de datos clinics_db.json inyectada correctamente (' + Object.keys(database).length + ' clinicas).');
