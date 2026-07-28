'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AddressForm } from '@/components/account/address-form';
import { Plus, Edit2, Trash2, MapPin } from 'lucide-react';
import { CUSTOMER_ADDRESSES_QUERY } from '@/lib/shopify/queries/customer';
// We'd typically fetch server-side in a server component, 
// but we need client-side state for the add/edit toggling without full page reloads,
// so let's use a standard client approach or fetch from server action.

// To keep it simple for the UI shell, we will fetch data in a useEffect or Server Action.
// Here we'll simulate fetching since the `customerFetch` requires the token, which is easiest server-side.

export default function AddressesPage() {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Simulated data for UI
  const addresses = [
    {
      id: '1',
      firstName: 'Najim',
      lastName: 'Customer',
      address1: '123 Fashion St',
      city: 'San Francisco',
      province: 'CA',
      zip: '94105',
      country: 'United States',
      isDefault: true,
    }
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Saved Addresses</h2>
        {!isAdding && !editingId && (
          <Button onClick={() => setIsAdding(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Add Address
          </Button>
        )}
      </div>

      {isAdding && (
        <div className="rounded-lg border p-6 bg-card mb-8">
          <h3 className="font-semibold text-lg mb-4">Add New Address</h3>
          <AddressForm 
            onCancel={() => setIsAdding(false)} 
            onSuccess={() => setIsAdding(false)} 
          />
        </div>
      )}

      {!isAdding && addresses.length === 0 && (
        <div className="rounded-lg border border-dashed p-12 text-center bg-card">
          <MapPin className="h-8 w-8 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">You haven't saved any addresses yet.</p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {!isAdding && addresses.map((address) => (
          <div key={address.id} className={`rounded-lg border p-6 bg-card relative ${address.isDefault ? 'border-primary/50 ring-1 ring-primary/50' : ''}`}>
            {editingId === address.id ? (
              <div>
                <h3 className="font-semibold text-lg mb-4">Edit Address</h3>
                <AddressForm 
                  address={address} 
                  onCancel={() => setEditingId(null)} 
                  onSuccess={() => setEditingId(null)} 
                />
              </div>
            ) : (
              <>
                {address.isDefault && (
                  <span className="absolute top-6 right-6 text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
                    Default
                  </span>
                )}
                <address className="not-italic text-sm space-y-1 mb-6 text-muted-foreground">
                  <p className="font-medium text-foreground text-base mb-2">
                    {address.firstName} {address.lastName}
                  </p>
                  <p>{address.address1}</p>
                  <p>{address.city}, {address.province} {address.zip}</p>
                  <p>{address.country}</p>
                </address>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setEditingId(address.id)} className="gap-2">
                    <Edit2 className="h-3.5 w-3.5" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2 text-destructive hover:bg-destructive hover:text-destructive-foreground">
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
