import { getCustomerAccessToken } from '@/lib/shopify/auth';
import { redirect } from 'next/navigation';
import { AccountNav } from '@/components/account/account-nav';

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = await getCustomerAccessToken();

  if (!token) {
    redirect('/login');
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="flex flex-col md:flex-row gap-8 md:gap-12">
        <aside className="w-full md:w-64 shrink-0">
          <div className="sticky top-24">
            <h1 className="text-2xl font-bold tracking-tight mb-6">My Account</h1>
            <AccountNav />
          </div>
        </aside>
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
