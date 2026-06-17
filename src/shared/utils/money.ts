export function formatMoney(amount: number | null | undefined, currency = 'USD'): string {
  if (amount == null || Number.isNaN(amount)) return '—';
  try {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
}

export function estimateStayTotal(
  pricePerNight: number,
  nights: number,
  rooms: number,
): { subtotal: number; iva: number; total: number } {
  const subtotal = pricePerNight * nights * rooms;
  const iva = subtotal * 0.15;
  return { subtotal, iva, total: subtotal + iva };
}
