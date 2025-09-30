import React from 'react'
import type { Sku, Variation } from '../../typings/variation'
import styles from '../ProductGroup/styles.css'

interface Props {
  variation: Variation
  selectedSku: Sku
  onSkuChange: (newSku: Sku) => void
}

const SkuSelector: React.FC<Props> = ({
  variation,
  selectedSku,
  onSkuChange,
}) => {
  const { dimensionsMap, skus } = variation

  const handleDimensionChange = (
    dimension: 'Talla' | 'Color',
    value: string
  ) => {
    const currentDimensions = { ...selectedSku.dimensions }

    currentDimensions[dimension] = value

    let newSku = skus.find((sku) => {
      return (
        sku.dimensions.Talla === currentDimensions.Talla &&
        sku.dimensions.Color === currentDimensions.Color
      )
    })

    if (!newSku || !newSku.available) {
      const alternativeDimension = dimension === 'Talla' ? 'Color' : 'Talla'

      newSku = skus.find((sku) => {
        return (
          sku.dimensions[alternativeDimension] ===
            selectedSku.dimensions[alternativeDimension] && sku.available
        )
      })
    }

    if (newSku) {
      onSkuChange(newSku)
    }
  }

  const getColorImageUrl = (color: string) => {
    const skuForColor = skus.find((sku) => sku.dimensions.Color === color)

    if (!skuForColor) return ''

    const baseUrl = skuForColor.image.split('-')[0]
    const imageId = baseUrl.split('/').pop()

    return `${baseUrl.substring(
      0,
      baseUrl.lastIndexOf('/')
    )}/${imageId}-46-46/width=46&height=46&aspect=true`
  }

  return (
    <>
      {dimensionsMap.Talla && dimensionsMap.Talla.length > 0 && (
        <div className={styles['options-section']}>
          <div className={styles['options-label']}>Talla</div>
          <div className={styles['size-options']}>
            {dimensionsMap.Talla.map((talla) => (
              <button
                key={talla}
                title={talla}
                onClick={() => handleDimensionChange('Talla', talla)}
                className={`${styles['size-btn']} ${
                  selectedSku.dimensions.Talla === talla ? styles.active : ''
                } ${
                  !skus.some(
                    (sku) => sku.dimensions.Talla === talla && sku.available
                  )
                    ? styles.tallaDisabled
                    : ''
                }`}
              >
                {talla}
              </button>
            ))}
          </div>
        </div>
      )}

      {dimensionsMap.Color && dimensionsMap.Color.length > 0 && (
        <div className={styles['options-section']}>
          <div className={styles['options-label']}>Color</div>
          <div className={styles['color-options']}>
            {dimensionsMap.Color.map((color) => (
              <button
                key={color}
                title={color}
                onClick={() => handleDimensionChange('Color', color)}
                disabled={
                  !skus.some(
                    (sku) => sku.dimensions.Color === color && sku.available
                  )
                }
                className={`${styles['color-btn']} ${
                  selectedSku.dimensions.Color === color ? styles.active : ''
                } ${
                  !skus.some(
                    (sku) => sku.dimensions.Color === color && sku.available
                  )
                    ? styles.colorDisabled
                    : ''
                }`}
              >
                {!skus.some(
                  (sku) => sku.dimensions.Color === color && sku.available
                ) && (
                  <>
                    <span className={styles.colorDisabledLineRight} />
                    <span className={styles.colorDisabledLineLeft} />
                  </>
                )}
                <img
                  src={getColorImageUrl(color)}
                  alt={color}
                  style={{ width: '100%', height: '100%' }}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default SkuSelector
