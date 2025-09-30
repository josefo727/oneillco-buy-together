import { useMemo, useState, useEffect } from 'react'
import {CartSimulationResult, CartSKU} from '../typings/product'

export const useCartSimulation = (products: CartSKU[]): CartSimulationResult => {
  const [simulationResult, setSimulationResult] = useState<CartSimulationResult>({
    regularTotal: 0,
    discountedTotal: null,
    discountPercentage: null,
    loading: true
  })

  const regularTotal = useMemo(() => {
    return products.reduce((sum, product) => sum + (product.price), 0)
  }, [products])

  const simulationItems = useMemo(() => {
    return products.map(product => ({
      id: product.itemId,
      quantity: 1,
      seller: product.sellerId || "1"
    }))
  }, [products])

  useEffect(() => {
    const simulateCart = async () => {
      if (products.length === 0) {
        setSimulationResult({
          regularTotal: 0,
          discountedTotal: null,
          discountPercentage: null,
          loading: false
        })
        return
      }

      try {
        setSimulationResult((prev: CartSimulationResult) => ({ ...prev, loading: true }))

        const response = await fetch('/api/checkout/pub/orderforms/simulation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ items: simulationItems }),
        })

        if (!response.ok) {
          throw new Error(`Error in cart simulation: ${response.status}`)
        }

        const cartData = await response.json()

        const itemsTotalEntry = cartData.totals.find((total: any) => total.id === 'Items');
        const discountsTotalEntry = cartData.totals.find((total: any) => total.id === 'Discounts');

        const rawItemsTotal = itemsTotalEntry ? itemsTotalEntry.value : 0;
        const rawDiscountsTotal = discountsTotalEntry ? discountsTotalEntry.value : 0;

        const simulatedRegularTotal = rawItemsTotal / 100;
        const simulatedDiscountedTotal = (rawItemsTotal + rawDiscountsTotal) / 100;

        let discountPercentage = null;
        if (simulatedDiscountedTotal < simulatedRegularTotal) {
          discountPercentage = Math.round(((simulatedRegularTotal - simulatedDiscountedTotal) / simulatedRegularTotal) * 100);
        }

        setSimulationResult({
          regularTotal: simulatedRegularTotal,
          discountedTotal: simulatedDiscountedTotal,
          discountPercentage,
          loading: false
        });
      } catch (error) {
        console.error('Error simulating the cart:', error)
        setSimulationResult({
          regularTotal,
          discountedTotal: null,
          discountPercentage: null,
          loading: false,
          error: error instanceof Error ? error : new Error('Unknown error while simulating the cart')
        })
      }
    }

    if (products.length > 0) {
      simulateCart()
        .then()
    } else {
      setSimulationResult({
        regularTotal: 0,
        discountedTotal: null,
        discountPercentage: null,
        loading: false
      })
    }
  }, [simulationItems, regularTotal, products.length])

  return simulationResult
}
