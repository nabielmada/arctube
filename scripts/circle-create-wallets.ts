import { initiateDeveloperControlledWalletsClient } from '@circle-fin/developer-controlled-wallets';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const apiKey = process.env.CIRCLE_API_KEY;
const entitySecret = process.env.CIRCLE_ENTITY_SECRET;

if (!apiKey || !entitySecret) {
  console.error('❌ Missing CIRCLE_API_KEY or CIRCLE_ENTITY_SECRET in .env');
  process.exit(1);
}

const circle = initiateDeveloperControlledWalletsClient({
  apiKey,
  entitySecret,
});

async function main() {
  console.log('🚀 Starting Circle Wallet Generation for DB-Less ArcTube...');

  try {
    // 1. Create a Wallet Set
    console.log('\n📦 1. Creating Wallet Set...');
    const walletSetRes = await circle.createWalletSet({
      name: `ArcTube Hackathon Set ${Date.now()}`,
    });
    const walletSetId = walletSetRes.data?.walletSet?.id;
    console.log(`   ✅ Wallet Set Created: ${walletSetId}`);

    // 2. Create 2 Wallets (Source and Destination)
    console.log('\n👛 2. Creating Wallets (Source & Destination) on ARC-TESTNET...');
    const walletsRes = await circle.createWallets({
      blockchains: ['ARC-TESTNET'],
      count: 2,
      walletSetId: walletSetId!,
      accountType: 'SCA', // Smart Contract Account
    });

    const wallets = walletsRes.data?.wallets;
    if (!wallets || wallets.length < 2) {
      throw new Error('Failed to create wallets');
    }

    const sourceWallet = wallets[0];
    const destinationWallet = wallets[1];

    console.log(`   ✅ Source Wallet (Viewer) Created!`);
    console.log(`      ID: ${sourceWallet.id}`);
    console.log(`      Address: ${sourceWallet.address}`);
    
    console.log(`   ✅ Destination Wallet (Creator) Created!`);
    console.log(`      ID: ${destinationWallet.id}`);
    console.log(`      Address: ${destinationWallet.address}`);

    console.log('\n' + '━'.repeat(60));
    console.log('🎉 SUCCESS! Update your .env file with these values:\n');
    console.log(`CIRCLE_WALLET_SET_ID=${walletSetId}`);
    console.log(`SOURCE_WALLET_ID=${sourceWallet.id}`);
    console.log(`DESTINATION_WALLET_ADDRESS=${destinationWallet.address}`);
    console.log('━'.repeat(60));

    console.log('\n⚠️  ACTION REQUIRED:');
    console.log(`1. Copy the Source Wallet Address: ${sourceWallet.address}`);
    console.log(`2. Go to https://faucet.arc.network/ (or the Arc Faucet)`);
    console.log(`3. Request Testnet USDC for that address.`);
    console.log(`4. Once funded, the ArcTube backend can execute real Nanopayments!\n`);

  } catch (error: any) {
    console.error('\n❌ Error generating wallets:', error.response?.data || error.message);
  }
}

main();
