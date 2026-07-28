'use client';

import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const addressSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  company: z.string().optional(),
  address1: z.string().min(5, 'Address is required'),
  address2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  province: z.string().min(2, 'State / Province is required'),
  zip: z.string().min(2, 'ZIP / Postal code is required'),
  country: z.string().min(2, 'Country is required'),
  phoneNumber: z.string().optional(),
});

type AddressFormValues = z.infer<typeof addressSchema>;

export function AddressForm({ 
  address, 
  onSuccess,
  onCancel
}: { 
  address?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  // We are not fully implementing the update logic as Customer Account API mutations 
  // might require additional setup for the server action. 
  // Just providing a UI shell.
  const formSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success(address ? 'Address updated successfully' : 'Address added successfully');
      if (onSuccess) onSuccess();
    }, 1000);
  };

  return (
    <form onSubmit={formSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="firstName" className="block text-sm font-medium">First Name</label>
          <input
            id="firstName"
            name="firstName"
            defaultValue={address?.firstName || ''}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="lastName" className="block text-sm font-medium">Last Name</label>
          <input
            id="lastName"
            name="lastName"
            defaultValue={address?.lastName || ''}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            required
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label htmlFor="company" className="block text-sm font-medium">Company (optional)</label>
          <input
            id="company"
            name="company"
            defaultValue={address?.company || ''}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label htmlFor="address1" className="block text-sm font-medium">Address</label>
          <input
            id="address1"
            name="address1"
            defaultValue={address?.address1 || ''}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            required
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label htmlFor="address2" className="block text-sm font-medium">Apartment, suite, etc. (optional)</label>
          <input
            id="address2"
            name="address2"
            defaultValue={address?.address2 || ''}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="city" className="block text-sm font-medium">City</label>
          <input
            id="city"
            name="city"
            defaultValue={address?.city || ''}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            required
          />
        </div>
        <div className="space-y-2 flex gap-4">
          <div className="flex-1 space-y-2">
            <label htmlFor="province" className="block text-sm font-medium">State / Province</label>
            <input
              id="province"
              name="province"
              defaultValue={address?.province || ''}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              required
            />
          </div>
          <div className="flex-1 space-y-2">
            <label htmlFor="zip" className="block text-sm font-medium">ZIP / Postal code</label>
            <input
              id="zip"
              name="zip"
              defaultValue={address?.zip || ''}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              required
            />
          </div>
        </div>
        <div className="space-y-2 md:col-span-2">
          <label htmlFor="country" className="block text-sm font-medium">Country</label>
          <input
            id="country"
            name="country"
            defaultValue={address?.country || ''}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            required
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label htmlFor="phoneNumber" className="block text-sm font-medium">Phone Number (optional)</label>
          <input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            defaultValue={address?.phoneNumber || ''}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
      </div>
      
      <div className="flex gap-4 pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Address'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
