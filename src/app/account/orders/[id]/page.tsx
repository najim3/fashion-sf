import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { customerFetch } from '@/lib/shopify/customer-client';
import { CUSTOMER_ORDER_QUERY } from '@/lib/shopify/queries/customer';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Order Details',
};

export default async function OrderDetailsPage({ params }: { params: { id: string } }) {
  // reconstruct the full ID since it comes from the URL as the last part
  const fullId = `gid://shopify/Order/${params.id}`;
  
  let order;
  try {
    const res = await customerFetch({ query: CUSTOMER_ORDER_QUERY, variables: { id: fullId } });
    order = res.data?.order;
  } catch (error) {
    console.error(error);
  }

  if (!order) {
    notFound();
  }

  const isFulfilled = order.fulfillmentStatus === 'FULFILLED';
  const isPaid = order.financialStatus === 'PAID';
  const date = new Date(order.processedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/account/orders" className={buttonVariants({ variant: "ghost", size: "icon" })}>
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back to orders</span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight">Order {order.name}</h2>
        <Badge variant={isFulfilled ? 'default' : 'secondary'} className="ml-auto">
          {order.fulfillmentStatus}
        </Badge>
        <Badge variant={isPaid ? 'default' : 'outline'}>
          {order.financialStatus}
        </Badge>
      </div>

      <p className="text-muted-foreground">Placed on {date}</p>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-lg border shadow-sm overflow-hidden">
            <div className="p-4 bg-muted/50 border-b">
              <h3 className="font-semibold">Items</h3>
            </div>
            <div className="divide-y">
              {order.lineItems?.edges.map(({ node: item }: any) => (
                <div key={item.id} className="p-4 flex gap-4">
                  <div className="h-20 w-20 relative rounded-md border overflow-hidden shrink-0 bg-muted">
                    {item.image?.url && (
                      <Image
                        src={item.image.url}
                        alt={item.image.altText || item.title}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-medium">{item.title}</h4>
                      {item.variantTitle && (
                        <p className="text-sm text-muted-foreground">{item.variantTitle}</p>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-muted-foreground">Qty: {item.quantity}</span>
                      <span className="font-medium">
                        {item.price.currencyCode} {item.price.amount}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border shadow-sm p-6 bg-card">
            <h3 className="font-semibold mb-4">Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{order.subtotalPrice?.currencyCode} {order.subtotalPrice?.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{order.totalShippingPrice?.currencyCode} {order.totalShippingPrice?.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>{order.totalTax?.currencyCode} {order.totalTax?.amount}</span>
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                <span>Total</span>
                <span>{order.totalPrice?.currencyCode} {order.totalPrice?.amount}</span>
              </div>
            </div>
          </div>

          {order.shippingAddress && (
            <div className="rounded-lg border shadow-sm p-6 bg-card text-sm">
              <h3 className="font-semibold mb-4">Shipping Address</h3>
              <address className="not-italic text-muted-foreground space-y-1">
                <p className="text-foreground font-medium">
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                </p>
                <p>{order.shippingAddress.address1}</p>
                {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.zip}
                </p>
                <p>{order.shippingAddress.country}</p>
              </address>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
