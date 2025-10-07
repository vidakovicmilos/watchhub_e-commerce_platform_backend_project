export class PriceUtils {
  static calculateFinalPrice(price: number, discount: number): number {
    if (!discount || discount == 0) return price;
    return Number((price - (price * discount) / 100).toFixed(2));
  }
}
