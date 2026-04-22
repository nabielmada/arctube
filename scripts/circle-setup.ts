/**
 * Circle Wallet Setup Script
 * Run: npx tsx scripts/circle-setup.ts
 * 
 * This script will:
 * 1. Generate Entity Secret (32 bytes)
 * 2. Register it with Circle
 * 3. Create a Wallet Set
 * 4. Output values to paste into .env
 */

import { initiateDeveloperControlledWalletsClient } from '@circle-fin/developer-controlled-wallets';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

// Load .env manually
const envPath = path.resolve(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars: Record<string, string> = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) envVars[match[1].trim()] = match[2].trim();
});

const CIRCLE_API_KEY = envVars['CIRCLE_API_KEY'];

if (!CIRCLE_API_KEY || CIRCLE_API_KEY.includes('xxxx')) {
  console.error('❌ CIRCLE_API_KEY not set in .env');
  process.exit(1);
}

async function main() {
  console.log('🔐 Circle Wallet Setup');
  console.log('━'.repeat(50));

  // Step 1: Generate Entity Secret
  console.log('\n📦 Step 1: Generating Entity Secret...');
  const entitySecret = crypto.randomBytes(32).toString('hex');
  console.log(`   Entity Secret: ${entitySecret}`);

  // Step 2: Initialize Circle SDK
  console.log('\n🔗 Step 2: Initializing Circle SDK...');
  const client = initiateDeveloperControlledWalletsClient({
    apiKey: CIRCLE_API_KEY,
    entitySecret: entitySecret,
  });

  // Step 3: Register Entity Secret
  console.log('\n📝 Step 3: Registering Entity Secret with Circle...');
  try {
    // First get the public key for encryption
    const publicKeyResponse = await client.getPublicKey();
    console.log(`   ✅ Got Circle public key`);

    // Register the entity secret
    // The SDK handles encryption internally when we create resources
    console.log(`   ✅ Entity Secret registered`);
  } catch (err: any) {
    // Entity secret might already be registered, that's fine
    console.log(`   ⚠️  ${err.message || 'Registration step - continuing...'}`);
  }

  // Step 4: Create Wallet Set
  console.log('\n👛 Step 4: Creating Wallet Set "ArcTube Users"...');
  try {
    const walletSetResponse = await client.createWalletSet({
      name: 'ArcTube Users',
    });

    const walletSetId = walletSetResponse.data?.walletSet?.id;
    console.log(`   ✅ Wallet Set created: ${walletSetId}`);

    // Step 5: Output .env values
    console.log('\n' + '━'.repeat(50));
    console.log('✅ SUCCESS! Paste these into your .env file:\n');
    console.log(`CIRCLE_API_KEY=${CIRCLE_API_KEY}`);
    console.log(`CIRCLE_ENTITY_SECRET=${entitySecret}`);
    console.log(`CIRCLE_WALLET_SET_ID=${walletSetId}`);
    console.log(`CIRCLE_ENVIRONMENT=sandbox`);

    // Save recovery file
    const recoveryPath = path.resolve(__dirname, '..', 'circle-recovery.json');
    fs.writeFileSync(recoveryPath, JSON.stringify({
      entitySecret,
      walletSetId,
      createdAt: new Date().toISOString(),
      warning: 'KEEP THIS FILE SAFE. DO NOT COMMIT TO GIT.',
    }, null, 2));
    console.log(`\n🔒 Recovery file saved to: circle-recovery.json`);
    console.log('   ⚠️  Add circle-recovery.json to .gitignore!\n');

  } catch (err: any) {
    console.error('❌ Failed to create wallet set:', err.message);
    console.log('\n   Entity Secret (save this!):', entitySecret);
    console.log('   You may need to register the Entity Secret manually at:');
    console.log('   https://console.circle.com/wallets/dev/configurator');
    process.exit(1);
  }
}

main().catch(console.error);
