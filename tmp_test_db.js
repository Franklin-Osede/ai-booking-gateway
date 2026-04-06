const { Client } = require('pg');

const regions = [
  'eu-central-1',
  'eu-west-1',
  'eu-west-2',
  'eu-west-3',
  'eu-south-1',
  'us-east-1',
  'us-east-2',
  'us-west-1',
];

async function testConnection() {
  for (const region of regions) {
    const connString = `postgresql://postgres.jcpchhrhtuvsqsuigmvz:1014Franlondon%40%40@aws-0-${region}.pooler.supabase.com:6543/postgres`;
    console.log(`Testing region: ${region}...`);
    
    // We decode the password for pg client since we are passing it directly in string or we just pass the URL
    const client = new Client({
      connectionString: connString,
      statement_timeout: 3000
    });
    
    try {
      await client.connect();
      console.log(`✅ SUCCESS on region: ${region}`);
      await client.end();
      return region;
    } catch (e) {
      console.log(`❌ Failed on region: ${region} - ${e.message}`);
    }
  }
}

testConnection();
