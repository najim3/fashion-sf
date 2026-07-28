import { Metadata } from 'next';
import { customerFetch } from '@/lib/shopify/customer-client';
import { CUSTOMER_DETAILS_QUERY } from '@/lib/shopify/queries/customer';
import { ProfileForm } from '@/components/account/profile-form';

export const metadata: Metadata = {
  title: 'My Profile',
};

export default async function ProfilePage() {
  const res = await customerFetch({ query: CUSTOMER_DETAILS_QUERY });
  const customer = res.data?.customer;

  if (!customer) {
    return <div>Failed to load profile details.</div>;
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold tracking-tight mb-6">My Profile</h2>
      <div className="rounded-lg border p-6 shadow-sm bg-card">
        <ProfileForm customer={customer} />
      </div>
    </div>
  );
}
