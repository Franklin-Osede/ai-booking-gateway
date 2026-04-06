const { Client } = require('pg');

async function main() {
  const connString = 'postgresql://postgres.jcpchhrhtuvsqsuigmvz:1014Franlondon%40%40@aws-1-eu-west-1.pooler.supabase.com:6543/postgres';
  const client = new Client({
    connectionString: connString,
    statement_timeout: 10000,
    ssl: { rejectUnauthorized: false }
  });
  
  await client.connect();
  console.log('Direct connection established...');
  
  try {
    const result = await client.query(`DELETE FROM "Clinic" WHERE name = 'Canarias'`);
    console.log(`Deleted ${result.rowCount} clinics with the name 'Canarias'.`);
  } catch (e) {
    console.error('Deletion error:', e.message);
  } finally {
    await client.end();
  }
}

main();
