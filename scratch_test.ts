import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function run() {
  const { getProducts, getProductByHandle } = await import('./src/lib/shopify/queries/products');
  
  const { products } = await getProducts({ first: 20 });
  console.log('Available products count:', products.length);
  console.log('Product handles:', products.map((p: any) => p.handle));

  for (const p of products) {
    const prod = await getProductByHandle(p.handle);
    console.log(`Handle "${p.handle}": ${prod ? prod.title : 'NULL (FETCH FAILED)'}`);
  }
}

run().catch(console.error);
