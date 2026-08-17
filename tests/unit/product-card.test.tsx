import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ProductCard } from '@/components/product/product-card';

// Mock Money component from Hydrogen
vi.mock('@shopify/hydrogen-react', () => ({
  Money: ({ data, className }: any) => (
    <span className={className} data-testid="money-mock">
      {data.currencyCode} {data.amount}
    </span>
  ),
}));

// Mock WishlistButton since it relies on Zustand and other client logic
vi.mock('@/components/product/wishlist-button', () => ({
  WishlistButton: ({ productHandle }: any) => (
    <button data-testid="wishlist-btn" data-handle={productHandle}>
      Wishlist
    </button>
  ),
}));

describe('ProductCard', () => {
  const mockProductStringPrice = {
    id: '1',
    handle: 'test-product',
    title: 'Test Product',
    price: '$25.00',
    image: '/test.jpg',
  };

  const mockProductObjectPrice = {
    id: '2',
    handle: 'test-product-2',
    title: 'Test Product 2',
    vendor: 'Test Vendor',
    price: { amount: '35.00', currencyCode: 'USD' },
    compareAtPrice: { amount: '50.00', currencyCode: 'USD' },
    image: '/test2.jpg',
    isNew: true,
  };

  it('renders product details with string price correctly', () => {
    render(<ProductCard product={mockProductStringPrice} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$25.00')).toBeInTheDocument();
    expect(screen.getByAltText('Test Product')).toBeInTheDocument();
  });

  it('renders product details with object price using Money component', () => {
    render(<ProductCard product={mockProductObjectPrice} />);
    
    expect(screen.getByText('Test Vendor')).toBeInTheDocument();
    expect(screen.getByText('Test Product 2')).toBeInTheDocument();
    
    const moneyMocks = screen.getAllByTestId('money-mock');
    expect(moneyMocks).toHaveLength(2); // Price and CompareAtPrice
    expect(moneyMocks[0]).toHaveTextContent('USD 35.00');
    expect(moneyMocks[1]).toHaveTextContent('USD 50.00');
  });

  it('displays New and Sale badges', () => {
    render(<ProductCard product={mockProductObjectPrice} />);
    
    expect(screen.getByText('New')).toBeInTheDocument();
    expect(screen.getByText('Sale')).toBeInTheDocument();
  });

  it('passes handle to WishlistButton', () => {
    render(<ProductCard product={mockProductStringPrice} />);
    
    const wishlistBtn = screen.getByTestId('wishlist-btn');
    expect(wishlistBtn).toHaveAttribute('data-handle', 'test-product');
  });
});
