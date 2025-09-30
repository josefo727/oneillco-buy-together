import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import type { Variation } from '../typings/variation'

const fetchProductVariation = async (
  productId: number
): Promise<Variation | null> => {
  try {
    const { data } = await axios.get<Variation>(
      `/api/catalog_system/pub/products/variations/${productId}`
    )
    return data
  } catch (error) {
    console.error(`Error fetching variation for product ${productId}:`, error)
    return null
  }
}

const useProductVariations = (productIds: number[]) => {
  const [variations, setVariations] = useState<Array<Variation | null>>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  const stringifiedProductIds = useMemo(() => JSON.stringify(productIds), [
    productIds,
  ])

  useEffect(() => {
    const fetchVariations = async () => {
      const ids = JSON.parse(stringifiedProductIds) as number[]
      if (ids.length === 0) {
        setVariations([])
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const promises = ids.map((id) => fetchProductVariation(id))
        const results = await Promise.all(promises)
        setVariations(results.filter((result) => result !== null))
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchVariations().then()
  }, [stringifiedProductIds])

  return { variations, loading, error }
}

export default useProductVariations
