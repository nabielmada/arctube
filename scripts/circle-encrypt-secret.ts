/**
 * Generate Entity Secret Ciphertext for Circle Dashboard Registration
 * 
 * This script:
 * 1. Fetches Circle's public key
 * 2. Encrypts your Entity Secret with RSA-OAEP SHA-256
 * 3. Outputs the 684-char ciphertext to paste into Circle Dashboard
 * 
 * Run: npx tsx scripts/circle-encrypt-secret.ts
 */

import * as crypto from 'crypto';
import * as https from 'https';

const ENTITY_SECRET_HEX = '0c57a8676c1cac96fbcf10874e185a48fe1137e17f656a814b507fdad6548d1a';

/**
 * Fetch Circle's public key via HTTPS
 */
function fetchPublicKey(): Promise<string> {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.circle.com',
      path: '/v1/w3s/config/entity/publicKey',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.CIRCLE_API_KEY || ''}`,
        'Content-Type': 'application/json',
      },
      // Skip certificate validation for ISP interception issues
      rejectUnauthorized: false,
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.data?.publicKey) {
            resolve(parsed.data.publicKey);
          } else {
            reject(new Error(`Unexpected response: ${data}`));
          }
        } catch (e) {
          reject(new Error(`Failed to parse response: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

/**
 * Encrypt entity secret with RSA-OAEP SHA-256
 */
function encryptEntitySecret(entitySecretHex: string, publicKeyPem: string): string {
  const entitySecretBuf = Buffer.from(entitySecretHex, 'hex');

  const encrypted = crypto.publicEncrypt(
    {
      key: publicKeyPem,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    entitySecretBuf
  );

  return encrypted.toString('base64');
}

async function main() {
  console.log('🔐 Circle Entity Secret Encryption Tool');
  console.log('━'.repeat(50));
  console.log(`\n   Raw Entity Secret: ${ENTITY_SECRET_HEX.slice(0, 16)}...`);

  // Read API key from .env
  const fs = await import('fs');
  const path = await import('path');
  const envPath = path.resolve(__dirname, '..', '.env');
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const apiKeyMatch = envContent.match(/CIRCLE_API_KEY=(.+)/);
  const apiKey = apiKeyMatch?.[1]?.trim();

  if (!apiKey || apiKey.includes('xxxx')) {
    console.error('\n❌ CIRCLE_API_KEY not found in .env');
    process.exit(1);
  }

  // Set for the fetch function
  process.env.CIRCLE_API_KEY = apiKey;

  console.log('\n📡 Fetching Circle public key...');
  try {
    const publicKey = await fetchPublicKey();
    console.log('   ✅ Got public key');

    console.log('\n🔒 Encrypting entity secret with RSA-OAEP SHA-256...');
    const ciphertext = encryptEntitySecret(ENTITY_SECRET_HEX, publicKey);

    console.log(`   ✅ Ciphertext length: ${ciphertext.length} characters\n`);
    console.log('━'.repeat(50));
    console.log('📋 COPY THIS CIPHERTEXT and paste into Circle Dashboard:\n');
    console.log(ciphertext);
    console.log('\n' + '━'.repeat(50));
    console.log('\n✅ After registering, add to your .env:');
    console.log(`CIRCLE_ENTITY_SECRET=${ENTITY_SECRET_HEX}`);

  } catch (err: any) {
    console.error(`\n❌ Failed to fetch public key: ${err.message}`);
    console.log('\n📋 Alternative: Use this Node.js snippet in a VPN-enabled environment,');
    console.log('   or use the Circle SDK directly:\n');
    console.log(`   const sdk = initiateDeveloperControlledWalletsClient({`);
    console.log(`     apiKey: '${apiKey.slice(0, 20)}...',`);
    console.log(`     entitySecret: '${ENTITY_SECRET_HEX}',`);
    console.log(`   });`);
    console.log(`   // SDK auto-encrypts for each API call`);
  }
}

main();
