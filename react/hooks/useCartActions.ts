import { useOrderItems } from 'vtex.order-items/OrderItems'
import { usePixel } from 'vtex.pixel-manager'
import { useState } from 'react'
import { AddToCartResult } from "../typings/product";
import { sleep } from "../utils/time";

interface Product {
  itemId: string;
  quantity: number;
  price?: number;
  name?: string;
  imageUrl?: string;
}

export const useCartActions = () => {
  const { addItems } = useOrderItems();
  const { push } = usePixel();
  const [isAdding, setIsAdding] = useState(false);

  /**
   * Prepares a list of products for addition to the cart by filtering and transforming the input list.
   *
   * This function processes an array of product objects, filtering out products with a quantity of 0 or less,
   * and then mapping the remaining products to a new format suitable for cart operations.
   *
   * @param {Product[]} products - An array of product objects to be prepared for cart usage. Each product must include at least the `quantity` and `itemId` properties.
   *
   * @returns {Object[]} - A new array of transformed product objects where each object contains the following fields:
   *    - `id`: The `itemId` of the product.
   *    - `quantity`: The `quantity` of the product.
   *    - `seller`: A fixed string identifier, set to '1'.
   */
  const prepareProductsForCart = (products: Product[]) => {
    return products
      .filter((product) => product.quantity > 0)
      .map((product) => ({
        id: product.itemId,
        quantity: product.quantity,
        seller: '1',
      }));
  };

  /**
   * Transforms products array to analytics format for pixel tracking
   *
   * @param {Product[]} products - Array of products to transform
   * @returns {Object[]} Array of products in analytics format
   */
  const transformProductsForAnalytics = (products: Product[]) => {
    return products
      .filter((product) => product.quantity > 0)
      .map((product) => ({
        id: product.itemId,
        name: product.name || '',
        price: product.price || 0,
        quantity: product.quantity,
      }));
  };

  /**
   * Triggers add to cart analytics event using pixel manager
   *
   * @param {Product[]} products - Products that were added to cart
   */
  const trackAddToCart = async (products: Product[]) => {
    const analyticsProducts = transformProductsForAnalytics(products);

    if (analyticsProducts.length === 0) return;

    await sleep(1000).then();

    analyticsProducts.forEach((product) => {
      push({
        event: 'addToCart' as const,
        id: 'add-to-cart-button',
        productId: product.id,
        quantity: product.quantity,
      });
    });
  };

  /**
   * Asynchronously adds a list of products to the cart and triggers analytics event
   * to open the minicart.
   *
   * This method first prepares the provided products for the cart, checks if
   * there are any products to add, and then attempts to add them. If products
   * are successfully added, an analytics "addToCart" event is triggered
   * which should open the minicart.
   *
   * @param {Product[]} products - An array of product objects to be added to the cart.
   * @returns {Promise<AddToCartResult>} A promise resolving to an object indicating the
   * success status and a message describing the result of the operation.
   */
  const addProductsToCart = async (products: Product[]): Promise<AddToCartResult> => {
    setIsAdding(true);
    try {
      const cartProducts = prepareProductsForCart(products);

      if (cartProducts.length === 0) {
        return {
          success: false,
          message: 'Por favor selecciona al menos un producto',
        };
      }

      await addItems(cartProducts);

      await trackAddToCart(products);

      return {
        success: true,
        message: `${cartProducts.length} producto(s) agregado(s) al carrito`,
      };
    } catch (error) {
      console.error('Error al agregar productos al carrito:', error);
      return {
        success: false,
        message: 'Ocurrió un error al agregar los productos al carrito',
      };
    } finally {
      setIsAdding(false);
    }
  };

  return {
    addProductsToCart,
    isAdding,
  };
};
