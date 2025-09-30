import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import type { SkuDetails } from '../../typings/product'

const skuCache = new Map<number, SkuDetails[]>()

const fetchProductSkus = async (
  productId: number
): Promise<SkuDetails[] | null> => {
  if (skuCache.has(productId)) {
    return skuCache.get(productId) ?? null
  }

  try {
    const { data } = await axios.get<SkuDetails[]>(
      `/_v/get-product-skus/${productId}`
    )
    skuCache.set(productId, data)
    return data
  } catch (error) {
    console.error(`Error fetching skus for product ${productId}:`, error)
    return null
  }
}

const useProductSkus = (productId: number) => {
  const [skus, setSkus] = useState<SkuDetails[] | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  const stringifiedProductId = useMemo(() => JSON.stringify(productId), [
    productId,
  ])

  useEffect(() => {
    const fetchSkus = async () => {
      const id = JSON.parse(stringifiedProductId) as number
      if (!id) {
        setSkus(null)
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const result = await fetchProductSkus(id)
        setSkus(result)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchSkus().then()
  }, [stringifiedProductId])

  return { skus, loading, error }
}

export default useProductSkus
