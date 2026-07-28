'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, User, Package, MapPin, Heart, LogOut } from 'lucide-react';

const navItems = [
  {
    title: 'Dashboard',
    href: '/account/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Profile',
    href: '/account/profile',
    icon: User,
  },
  {
    title: 'Orders',
    href: '/account/orders',
    icon: Package,
  },
  {
    title: 'Addresses',
    href: '/account/addresses',
    icon: MapPin,
  },
  {
    title: 'Wishlist',
    href: '/account/wishlist',
    icon: Heart,
  },
];

export function AccountNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-2">
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive 
                ? "bg-primary text-primary-foreground" 
                : "hover:bg-muted hover:text-foreground text-muted-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {item.title}
          </Link>
        );
      })}
      <form action="/api/auth/logout" method="POST" className="mt-4">
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          Log Out
        </button>
      </form>
    </nav>
  );
}
