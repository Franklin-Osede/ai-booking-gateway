/* eslint-disable */
const fs = require('fs');
const path = require('path');

const DOMINIO_BASE = "https://demos.agentminds.io";
const COLOR_EMERGENCIA = "1a4b8c"; 

async function obtenerColor(urlClinica) {
    try {
        const response = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(urlClinica)}&palette=true`);
        const json = await response.json();
        
        if (json.status === 'success' && json.data) {
            if (json.data.logo && json.data.logo.color) return json.data.logo.color.replace('#', '');
            if (json.data.image && json.data.image.color) return json.data.image.color.replace('#', '');
        }
    } catch (_) {
        // Ignorar
    }
    return COLOR_EMERGENCIA;
}

function getSlugFromUrl(urlStr) {
    try {
      const url = new URL(urlStr);
      let hostname = url.hostname.replace('www.', '');
      return hostname.split('.')[0].substring(0, 30);
    } catch (_) {
      return 'clinica-' + Math.random().toString(36).substring(7);
    }
}

async function procesarCSVMagico() {
    console.log("🚀 Iniciando procesamiento del CSV Real de Hair Transplant...\n");
    
    const inputPath = '/Users/domoblock/Downloads/Leads  Business  - Hair Transplant.csv';
    const outputPath = path.join(__dirname, 'leads_procesados_final.csv');

    if (!fs.existsSync(inputPath)) {
        console.error("❌ No existe el archivo CSV en descargas.");
        return;
    }

    const contenidoRaw = fs.readFileSync(inputPath, 'utf-8');
    const lineas = contenidoRaw.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    
    // Añadimos la columna extra al header
    const lineasFinales = [lineas[0] + ",Link Demo Generado,Color Extraido"];

    console.log(`Tenemos ${lineas.length - 1} clínicas por procesar. Calculando...`);

    for (let i = 1; i < lineas.length; i++) {
        const columnas = lineas[i].split(',');
        const urlOriginal = columnas[1]?.trim();
        
        if (!urlOriginal || !urlOriginal.startsWith('http')) {
             lineasFinales.push(lineas[i] + ",,");
             continue;
        }
        
        const slug = getSlugFromUrl(urlOriginal);
        
        // Scraping de color
        process.stdout.write(`Extrayendo color de ${slug}... `);
        const colorDetectado = await obtenerColor(urlOriginal);
        console.log(`[#${colorDetectado}]`);
        
        const enlaceFinal = `${DOMINIO_BASE}/demo/${slug}?site=${urlOriginal}&color=${colorDetectado}&voice=elevenlabs`;
        
        lineasFinales.push(lineas[i] + `,${enlaceFinal},#${colorDetectado}`);
    }

    fs.writeFileSync(outputPath, lineasFinales.join('\n'));
    console.log(`\n🎉 COMPLETADO. El archivo final está en: ${outputPath}`);
}

procesarCSVMagico();
