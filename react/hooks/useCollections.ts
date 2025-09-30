import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import type { Variation } from '../typings/variation'

const fetchCollectionProducts = async (
  collectionId: number
): Promise<Variation[]> => {
  try {
    const { data } = await axios.get<Variation[]>(
      `/_v/get-collection-products/${collectionId}`
    )
    return await data
  } catch (error) {
    console.error(
      `Error fetching products for collection ${collectionId}:`,
      error
    )
    return []
  }
}

const useCollections = (collectionIds: number[]) => {
  const [collections, setCollections] = useState<Variation[][]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  const stringifiedCollectionIds = useMemo(
    () => JSON.stringify(collectionIds),
    [collectionIds]
  )

  useEffect(() => {
    const fetchCollections = async () => {
      const ids = JSON.parse(stringifiedCollectionIds) as number[]
      if (ids.length === 0) {
        setCollections([])
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const promises = ids.map((id) => fetchCollectionProducts(id))
        const results = await Promise.all(promises)
        setCollections(results)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchCollections().then()
  }, [stringifiedCollectionIds])

  return { collections, loading, error }
}

export default useCollections
