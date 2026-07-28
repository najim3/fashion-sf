import { Metadata } from 'next';
import Link from 'next/link';
import { customerFetch } from '@/lib/shopify/customer-client';
import { CUSTOMER_ORDERS_QUERY } from '@/lib/shopify/queries/customer';
import { OrderCard } from '@/components/account/order-card';
import { Button, buttonVariants } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Order History',
};

export default async function OrdersPage() {
  const res = await customerFetch({ query: CUSTOMER_ORDERS_QUERY, variables: { first: 50 } });
  const orders = res.data?.customer?.orders?.edges?.map((edge: any) => edge.node) || [];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Order History</h2>
      
      {orders.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center bg-card">
          <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
          <Link href="/collections/all" className={buttonVariants({ variant: "default" })}>
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map((order: any) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
