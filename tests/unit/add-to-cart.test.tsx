import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AddToCart } from '@/components/product/add-to-cart';

const mockLinesAdd = vi.fn();

vi.mock('@shopify/hydrogen-react', () => ({
  useCart: () => ({
    linesAdd: mockLinesAdd,
    checkoutUrl: 'https://checkout.shopify.com/123',
    status: 'idle',
  }),
}));

describe('AddToCart Component', () => {
  it('renders in stock status and enables Add to Cart button when availableForSale is true', () => {
    render(<AddToCart variantId="gid://shopify/ProductVariant/1" availableForSale={true} />);

    expect(screen.getByText('In Stock')).toBeInTheDocument();
    const addButton = screen.getByRole('button', { name: /add to cart/i });
    expect(addButton).not.toBeDisabled();
  });

  it('renders out of stock status and disables Add to Cart button when availableForSale is false', () => {
    render(<AddToCart variantId="gid://shopify/ProductVariant/1" availableForSale={false} />);

    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
    const addButton = screen.getByRole('button', { name: /add to cart/i });
    expect(addButton).toBeDisabled();
  });

  it('allows quantity increment and decrement', () => {
    render(<AddToCart variantId="gid://shopify/ProductVariant/1" availableForSale={true} />);

    const increaseBtn = screen.getByRole('button', { name: /increase quantity/i });
    const decreaseBtn = screen.getByRole('button', { name: /decrease quantity/i });

    expect(screen.getByText('1')).toBeInTheDocument();

    fireEvent.click(increaseBtn);
    expect(screen.getByText('2')).toBeInTheDocument();

    fireEvent.click(decreaseBtn);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('calls linesAdd with merchandiseId and quantity when clicked', () => {
    mockLinesAdd.mockReset();
    render(<AddToCart variantId="gid://shopify/ProductVariant/100" availableForSale={true} />);

    const addButton = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(addButton);

    expect(mockLinesAdd).toHaveBeenCalledWith([
      { merchandiseId: 'gid://shopify/ProductVariant/100', quantity: 1 }
    ]);
  });
});
