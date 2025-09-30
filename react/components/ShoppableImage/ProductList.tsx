import React, { useState } from 'react'
import styles from './ProductList.css'
import type { Variation, Sku } from '../../typings/variation'
import SkuSelector from '../SkuSelector'
import { useCartActions } from '../../hooks/useCartActions'
import { Progress } from 'vtex.styleguide'

interface ProductListProps {
  variations: Array<Variation | null>
  selectedSkus: { [key: number]: Sku }
  setSelectedSkus: React.Dispatch<React.SetStateAction<{ [key: number]: Sku }>>
  loading: boolean
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

const ProductList: StorefrontFunctionComponent<ProductListProps> = ({
  variations,
  selectedSkus,
  setSelectedSkus,
  loading,
}) => {
  const [openProductList, setOpenProductList] = useState<boolean>(false)
  const { addProductsToCart, isAdding } = useCartActions()

  const handleSkuChange = (productId: number, newSku: Sku) => {
    setSelectedSkus((prev) => ({ ...prev, [productId]: newSku }))
  }

  const handleAddToCart = async (sku: Sku) => {
    if (!sku) return

    const itemToAdd = {
      itemId: sku.sku.toString(),
      quantity: 1,
      price: sku.bestPrice,
      name: sku.skuname,
      imageUrl: sku.image,
    }

    await addProductsToCart([itemToAdd])
  }
  const transformImageUrl = (url: string): string => {
    try {
      const regex = /\/ids\/(\d+)-(\d+)-(\d+)\//
      const match = url.match(regex)

      if (!match) {
        return url
      }

      // Corregir la destructuración - los grupos capturados empiezan desde índice 1
      const [fullMatch, id, firstSize] = match
      const newPattern = `/ids/${id}-${firstSize}-auto/`

      console.log('Match completo:', fullMatch)

      return url.replace(regex, newPattern)
    } catch (error) {
      return url
    }
  }
  return (
    <div
      className={`${styles['product-list-container']} ${
        openProductList && styles['open-list']
      }`}
    >
      <button
        className={styles['btn-product-list']}
        onClick={() => setOpenProductList(!openProductList)}
      >
        {!openProductList ? <span>Lista</span> : <span>Cerrar</span>}
      </button>
      <div className={styles['product-list-content']}>
        {loading ? (
          <div className={styles['product-list']}>
            <Progress type="steps" danger steps={['inProgress']} />
          </div>
        ) : (
          variations.map((variation) => {
            if (!variation) return null

            const selectedSku = selectedSkus[variation.productId]
            if (!selectedSku) return null

            return (
              <div key={variation.productId} className={styles['product-list']}>
                <div className={styles['content-image-product']}>
                  <img
                    className={styles['image-product']}
                    src={transformImageUrl(selectedSku.image)}
                    alt={selectedSku.skuname}
                  />
                </div>
                <div className={styles['info-content']}>
                  <p className={styles['name-product']}>{variation.name}</p>
                  <p className={styles['price-product']}>
                    {formatPrice(selectedSku.bestPrice / 100)}
                  </p>
                  <SkuSelector
                    variation={variation}
                    selectedSku={selectedSku}
                    onSkuChange={(newSku) =>
                      handleSkuChange(variation.productId, newSku)
                    }
                  />
                  <button
                    className={`${styles['action-btn']} ${styles.addBtn}`}
                    onClick={() => handleAddToCart(selectedSku)}
                    disabled={isAdding}
                  >
                    Agregar al carrito
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
export default ProductList
