const { Client } = require('pg');
async function test() {
  const connString = 'postgresql://postgres.jcpchhrhtuvsqsuigmvz:1014Franlondon%40%40@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?sslmode=require';
  const client = new Client({
    connectionString: connString,
    statement_timeout: 3000
  });
  try {
    await client.connect();
    console.log('✅ DIRECT NODE PG CONNECTION SUCCESS!');
    await client.end();
  } catch (e) {
    console.log('❌ DIRECT NODE PG FAILED:', e.message);
  }
}
test();
