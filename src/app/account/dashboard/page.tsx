import { Metadata } from 'next';
import Link from 'next/link';
import { customerFetch } from '@/lib/shopify/customer-client';
import { CUSTOMER_DETAILS_QUERY, CUSTOMER_ORDERS_QUERY } from '@/lib/shopify/queries/customer';
import { OrderCard } from '@/components/account/order-card';
import { Button, buttonVariants } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Account Dashboard',
};

export default async function DashboardPage() {
  const [detailsRes, ordersRes] = await Promise.all([
    customerFetch({ query: CUSTOMER_DETAILS_QUERY }),
    customerFetch({ query: CUSTOMER_ORDERS_QUERY, variables: { first: 5 } }),
  ]);

  const customer = detailsRes.data?.customer;
  const orders = ordersRes.data?.customer?.orders?.edges?.map((edge: any) => edge.node) || [];

  if (!customer) {
    return <div>Failed to load customer details.</div>;
  }

  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Welcome back, {customer.firstName}!</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border p-6 shadow-sm">
            <h3 className="font-semibold text-lg mb-2">Profile Information</h3>
            <p className="text-muted-foreground">{customer.firstName} {customer.lastName}</p>
            <p className="text-muted-foreground">{customer.emailAddress?.emailAddress}</p>
            {customer.phoneNumber?.phoneNumber && (
              <p className="text-muted-foreground">{customer.phoneNumber.phoneNumber}</p>
            )}
            <Link href="/account/profile" className={buttonVariants({ variant: "outline", className: "mt-4" })}>
              Edit Profile
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold tracking-tight">Recent Orders</h2>
          <Link href="/account/orders" className={buttonVariants({ variant: "link" })}>
            View All
          </Link>
        </div>
        
        {orders.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
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
      </section>
    </div>
  );
}
