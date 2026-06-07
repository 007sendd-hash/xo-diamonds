/**
 * XO Diamonds – Client-side Cart
 * Persists to localStorage. Emits 'cart-updated' custom event.
 * Alpine.js components listen for updates.
 */

export interface CartItem {
  slug: string;
  title: string;
  price: number;
  image: string;
  size?: number;
  qty: number;
}

export function getCart(): CartItem[] {
  try {
    const raw = localStorage.getItem("xo-cart");
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function setCart(items: CartItem[]): void {
  localStorage.setItem("xo-cart", JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("cart-updated"));
}

export function addToCart(item: Omit<CartItem, "qty">, qty = 1): void {
  const cart = getCart();
  const idx = cart.findIndex(
    (i) => i.slug === item.slug && i.size === item.size,
  );
  if (cart[idx] !== undefined) {
    cart[idx].qty += qty;
  } else {
    cart.push({ ...item, qty });
  }
  setCart(cart);
}

export function removeFromCart(slug: string, size?: number): void {
  const cart = getCart().filter(
    (i) => !(i.slug === slug && i.size === size),
  );
  setCart(cart);
}

export function updateQty(slug: string, size: number | undefined, qty: number): void {
  const cart = getCart().map((i) =>
    i.slug === slug && i.size === size ? { ...i, qty: Math.max(1, qty) } : i,
  );
  setCart(cart);
}

export function cartTotal(cart: CartItem[]): number {
  return cart.reduce((sum, i) => sum + i.price * i.qty, 0);
}

export function cartCount(cart: CartItem[]): number {
  return cart.reduce((sum, i) => sum + i.qty, 0);
}

export function clearCart(): void {
  setCart([]);
}
