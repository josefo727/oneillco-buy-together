import React, {useEffect, useMemo, useState} from 'react'
import styles from './styles.css'
import SliderImageProductPDP from '../SliderImageProductPDP'
import type { Variation, Sku } from '../../../typings/variation'
import useProductSkus from '../../../hooks/useProductSkus'
import { Progress } from 'vtex.styleguide'
import SkuSelector from '../../SkuSelector'
import { useCartActions } from '../../../hooks/useCartActions'
import type { SkuDetails } from '../../../typings/product'

interface ModalShoppableImageProps {
  isOpen: boolean
  setOpenModalShoppableImage: (value: boolean) => void
  variation: Variation
  selectedSku: Sku
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

const ModalShoppableImage: React.FC<ModalShoppableImageProps> = ({
  isOpen,
  setOpenModalShoppableImage,
  variation,
  selectedSku,
}) => {
  const { skus, loading } = useProductSkus(variation.productId)
  const [currentSku, setCurrentSku] = useState<Sku>(selectedSku)
  const [currentSkuDetails, setCurrentSkuDetails] = useState<SkuDetails | null>(
    null
  )
  const { addProductsToCart, isAdding } = useCartActions()

  useEffect(() => {
    setCurrentSku(selectedSku)
  }, [selectedSku])

  useEffect(() => {
    if (skus) {
      const details = skus.find((sku) => sku.Id === currentSku.sku) ?? null
      setCurrentSkuDetails(details)
    }
  }, [skus, currentSku])

  const discountPercentage = useMemo(() => {
    if (currentSku.listPrice === 0) return 0
    return Math.round(
      ((currentSku.listPrice - currentSku.bestPrice) / currentSku.listPrice) * 100
    )
  }, [currentSku])

  const images = currentSkuDetails?.Images.filter(
    (image) => image.ImageName === ''
  )

  if (!isOpen) return null

  const handleSkuChange = (newSku: Sku) => {
    setCurrentSku(newSku)
  }

  const handleAddToCart = async () => {
    if (!currentSku) return

    const itemToAdd = {
      itemId: currentSku.sku.toString(),
      quantity: 1,
      price: currentSku.bestPrice,
      name: currentSku.skuname,
      imageUrl: currentSku.image,
    }

    await addProductsToCart([itemToAdd])
  }

  return (
    <div className={styles['modal-overlay']}>
      <div className={styles['modal-container']}>
        <div className={styles['modal-header']}>
          <button
            onClick={() => setOpenModalShoppableImage(false)}
            className={styles['close-button']}
          >
            &times;
          </button>
          {discountPercentage > 0 && <span className={styles["percentage-discount"]}>-{discountPercentage}%</span>}
        </div>

        <div className={styles['modal-content']}>
          {loading ? (
            <div className={styles['loading-image-section']}>
              <Progress type="steps" danger steps={['inProgress']} />
            </div>
          ) : (
            <div className={styles['slider-image-section']}>
              <SliderImageProductPDP
                productImages={images ?? []}
                skuId={currentSku.sku.toString()}
              />
            </div>
          )}

          <div className={styles['info-section']}>
            <h2 className={styles['product-title']}>{variation.name}</h2>

            <SkuSelector
              variation={variation}
              selectedSku={currentSku}
              onSkuChange={handleSkuChange}
            />

            <div className={styles['price-section']}>
              <div className={styles['price-container']}>
                <span className={styles['sale-price']}>
                  {formatPrice(currentSku.bestPrice / 100)}
                </span>
                {currentSku.listPrice > currentSku.bestPrice && (
                  <span className={styles['original-price']}>
                    {formatPrice(currentSku.listPrice / 100)}
                  </span>
                )}
              </div>
            </div>

            <button
              className={`${styles['add-to-cart-button']} ${
                isAdding ? styles['buy-button-loading'] : ''
              }`}
              onClick={handleAddToCart}
              disabled={isAdding}
            >
              Agregar al carrito
              {isAdding && <div className={styles['loading-bar']} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModalShoppableImage
