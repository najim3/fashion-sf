type ProductItem = {
  id: string;
  title: string;
  price?: string | number;
  handle?: string;
};

// Ensure window.gtag and window.fbq exist in TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    fbq: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const trackPageView = (url: string) => {
  if (typeof window !== "undefined") {
    // GA4
    if (window.gtag) {
      window.gtag("event", "page_view", {
        page_path: url,
      });
    }
    // Meta Pixel
    if (window.fbq) {
      window.fbq("track", "PageView");
    }
  }
};

export const trackViewProduct = (product: ProductItem) => {
  if (typeof window !== "undefined") {
    // GA4
    if (window.gtag) {
      window.gtag("event", "view_item", {
        currency: "USD",
        value: Number(product.price || 0),
        items: [
          {
            item_id: product.id,
            item_name: product.title,
            price: Number(product.price || 0),
          },
        ],
      });
    }
    // Meta Pixel
    if (window.fbq) {
      window.fbq("track", "ViewContent", {
        content_name: product.title,
        content_ids: [product.id],
        content_type: "product",
        value: Number(product.price || 0),
        currency: "USD",
      });
    }
  }
};

export const trackAddToCart = (product: ProductItem, quantity: number = 1) => {
  if (typeof window !== "undefined") {
    // GA4
    if (window.gtag) {
      window.gtag("event", "add_to_cart", {
        currency: "USD",
        value: Number(product.price || 0) * quantity,
        items: [
          {
            item_id: product.id,
            item_name: product.title,
            price: Number(product.price || 0),
            quantity,
          },
        ],
      });
    }
    // Meta Pixel
    if (window.fbq) {
      window.fbq("track", "AddToCart", {
        content_name: product.title,
        content_ids: [product.id],
        content_type: "product",
        value: Number(product.price || 0) * quantity,
        currency: "USD",
      });
    }
  }
};

export const trackRemoveFromCart = (product: ProductItem) => {
  if (typeof window !== "undefined") {
    // GA4
    if (window.gtag) {
      window.gtag("event", "remove_from_cart", {
        currency: "USD",
        value: Number(product.price || 0),
        items: [
          {
            item_id: product.id,
            item_name: product.title,
            price: Number(product.price || 0),
          },
        ],
      });
    }
  }
};

export const trackBeginCheckout = (cartValue: number, items: ProductItem[]) => {
  if (typeof window !== "undefined") {
    // GA4
    if (window.gtag) {
      window.gtag("event", "begin_checkout", {
        currency: "USD",
        value: cartValue,
        items: items.map((item) => ({
          item_id: item.id,
          item_name: item.title,
          price: Number(item.price || 0),
        })),
      });
    }
    // Meta Pixel
    if (window.fbq) {
      window.fbq("track", "InitiateCheckout", {
        content_ids: items.map((i) => i.id),
        content_type: "product",
        value: cartValue,
        currency: "USD",
      });
    }
  }
};

export const trackSearch = (query: string) => {
  if (typeof window !== "undefined") {
    // GA4
    if (window.gtag) {
      window.gtag("event", "search", {
        search_term: query,
      });
    }
    // Meta Pixel
    if (window.fbq) {
      window.fbq("track", "Search", {
        search_string: query,
      });
    }
  }
};
