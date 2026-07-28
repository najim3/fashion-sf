import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package } from 'lucide-react';

export function OrderCard({ order }: { order: any }) {
  const isFulfilled = order.fulfillmentStatus === 'FULFILLED';
  const isPaid = order.financialStatus === 'PAID';
  const date = new Date(order.processedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="rounded-lg border p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Package className="h-5 w-5 text-muted-foreground" />
          <h4 className="font-semibold text-lg">Order {order.name}</h4>
          <Badge variant={isFulfilled ? 'default' : 'secondary'}>
            {order.fulfillmentStatus}
          </Badge>
          <Badge variant={isPaid ? 'default' : 'outline'}>
            {order.financialStatus}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Placed on {date}
        </p>
        <p className="text-sm font-medium mt-1">
          Total: {order.totalPrice.currencyCode} {order.totalPrice.amount}
        </p>
      </div>
      <Link href={`/account/orders/${order.id.split('/').pop()}`} className={buttonVariants({ variant: "outline" })}>
        View Details
      </Link>
    </div>
  );
}
