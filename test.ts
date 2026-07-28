require('dotenv').config({ path: '.env.local' });
const { getCollections, getCollectionByHandle, getCollectionProducts } = require('./src/lib/shopify/queries/collections.ts');
async function run() {
  try {
    console.log('Testing getCollections...');
    await getCollections();
    console.log('Testing getCollectionByHandle...');
    await getCollectionByHandle('frontpage');
    console.log('Testing getCollectionProducts...');
    await getCollectionProducts('frontpage');
    console.log('All tests passed!');
  } catch (err) {
    console.error(err);
  }
}
run();
