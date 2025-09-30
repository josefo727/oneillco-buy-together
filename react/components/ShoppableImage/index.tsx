import React, { useState, useMemo, useEffect } from 'react'
import useProductVariations from '../../hooks/useProductVariations'
import type { ShoppableImageProps, Hotspot } from './typings'
import styles from './styles.css'
import ProductList from './ProductList'
import ModalShoppableImage from './ModalShoppableImage'
import type { Sku, Variation } from '../../typings/variation'

const ShoppableImage: StorefrontFunctionComponent<ShoppableImageProps> = ({
                                                                            title,
                                                                            mainImageDK,
                                                                            mainImageMB,
                                                                            hotspotsCoordinates = [],
                                                                          }) => {
  console.log(hotspotsCoordinates)
  useEffect(() => {
    console.log(hotspotsCoordinates)
  }, [hotspotsCoordinates]);
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedVariation, setSelectedVariation] = useState<Variation | null>(null)

  const { productIds, initialSkuIds } = useMemo(() => {
    const pIds: number[] = []
    const sIds: { [key: number]: number } = {}

    hotspotsCoordinates.forEach((hotspot) => {
      // Verificar que el hotspot tenga product y productId válido
      if (hotspot.product?.productId) {
        const productId = hotspot.product.productId

        if (!pIds.includes(productId)) {
          pIds.push(productId)
        }

        // Solo asignar skuId si existe y es válido
        if (hotspot.product.skuId) {
          sIds[productId] = hotspot.product.skuId
        }
      }
    })

    return { productIds: pIds, initialSkuIds: sIds }
  }, [hotspotsCoordinates])
  const { variations, loading } = useProductVariations(productIds)
  const [selectedSkus, setSelectedSkus] = useState<{ [key: number]: Sku }>({})

  useEffect(() => {
    if (variations.length > 0) {
      const initialSelections: { [key: number]: Sku } = {}
      variations.forEach((variation) => {
        if (variation) {
          const initialSkuId = initialSkuIds[variation.productId]
          let skuToSelect = null

          // Si tenemos un skuId inicial válido, intentar usarlo
          if (initialSkuId) {
            skuToSelect = variation.skus.find(
              (s) => s.sku === initialSkuId && s.available
            )
          }

          // Si no encontramos el SKU inicial o no existe, usar el primero disponible
          if (!skuToSelect) {
            skuToSelect = variation.skus.find((s) => s.available) ?? variation.skus[0]
          }

          if (skuToSelect) {
            initialSelections[variation.productId] = skuToSelect
          }
        }
      })
      setSelectedSkus(initialSelections)
    }
  }, [variations, initialSkuIds])

  const hotspots: Hotspot[] = useMemo(() => {
    if (!variations.length || !hotspotsCoordinates.length) {
      return []
    }

    return hotspotsCoordinates
      .map((coord) => {
        // Verificar que el hotspot tenga product y productId válido
        if (coord.product?.productId) {
          const productId = coord.product.productId
          const variation = variations.find((v) => v?.productId === productId)
          if (variation) {
            return coord
          }
        }
        return null
      })
      .filter((h) => h !== null) as Hotspot[]
  }, [variations, hotspotsCoordinates])

  // AHORA SÍ PODEMOS HACER EARLY RETURNS DESPUÉS DE TODOS LOS HOOKS
  if (!mainImageDK || !mainImageMB) {
    return (
      <div className={styles.shoppableImageContainer}>
        <div className={styles.placeholder}>Añade una imagen para mostrar</div>
      </div>
    )
  }

  const handleHotspotClick = (variation: Variation) => {
    setSelectedVariation(variation)
    setIsModalOpen(true)
  }

  const handleKeyPress = (
    event: React.KeyboardEvent,
    variation: Variation
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleHotspotClick(variation)
    }
  }

  const getVisibilityClass = (
    showOnDesktop: boolean | undefined,
    showOnMobile: boolean | undefined
  ) => {
    const shouldShowOnDesktop = showOnDesktop ?? true
    const shouldShowOnMobile = showOnMobile ?? true

    if (shouldShowOnDesktop && shouldShowOnMobile) return styles.show
    if (!shouldShowOnDesktop && !shouldShowOnMobile) return styles.hidden
    if (shouldShowOnDesktop) return styles.desktop
    if (shouldShowOnMobile) return styles.mobile
    return ''
  }

  return (
    <>
      <div className={styles.shoppableImageContainer}>
        {title ? <h2 className={styles.shoppableTitle}>{title}</h2> : ''}
        <div className={styles.shoppableImageContent}>
          <img
            src={mainImageDK}
            alt="Shoppable content"
            className={`${styles.shoppableImage} ${styles.desktop}`}
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
          <img
            src={mainImageMB}
            alt="Shoppable content"
            className={`${styles.shoppableImage} ${styles.mobile}`}
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        </div>
        <ProductList
          variations={variations}
          selectedSkus={selectedSkus}
          setSelectedSkus={setSelectedSkus}
          loading={loading}
        />
        {hotspots.length > 0 &&
          hotspots.map((hotspot: Hotspot, index: number) => {
            // Usar la nueva estructura del product
            const productId = hotspot.product?.productId
            if (!productId) return null

            const variation = variations.find((v) => v?.productId === productId)
            if (!variation) {
              return null
            }

            return (
              <div
                key={index}
                className={`${styles.hotspot} ${getVisibilityClass(
                  hotspot.showOnDesktop,
                  hotspot.showOnMobile
                )}`}
                style={{
                  top: `${Math.max(0, Math.min(100, hotspot.y))}%`,
                  left: `${Math.max(0, Math.min(100, hotspot.x))}%`,
                }}
              >
                <button
                  onClick={() => handleHotspotClick(variation)}
                  onKeyDown={(e) => handleKeyPress(e, variation)}
                  className={styles.hotspot}
                  aria-label={`View product ${variation.name}`}
                  type="button"
                >
                  +
                </button>
              </div>
            )
          })}
      </div>
      {selectedVariation && (
        <ModalShoppableImage
          isOpen={isModalOpen}
          setOpenModalShoppableImage={setIsModalOpen}
          variation={selectedVariation}
          selectedSku={selectedSkus[selectedVariation.productId]}
        />
      )}
    </>
  )
}

ShoppableImage.schema = {
  title: 'Shoppable Image',
  description: 'An image with clickable hotspots that link to products.',
  type: 'object',
  properties: {
    title: {
      title: 'Title Shoppable Image',
      type: 'string',
      default: 'Compra por escena',
    },
    mainImageDK: {
      title: 'Main Image Desktop',
      type: 'string',
      widget: {
        'ui:widget': 'image-uploader',
      },
    },
    mainImageMB: {
      title: 'Main Image Mobile',
      type: 'string',
      widget: {
        'ui:widget': 'image-uploader',
      },
    },
    hotspotsCoordinates: {
      title: 'Hotspots Coordinates',
      type: 'array',
      default: [
        {
          product: {
            productId: 10126,
            skuId: 34800
          },
          x: 10,
          y: 51,
          showOnDesktop: true,
          showOnMobile: true
        },
        {
          product: {
            productId: 9013,
            skuId: 30338
          },
          x: 24,
          y: 57,
          showOnDesktop: true,
          showOnMobile: true
        },
        {
          product: {
            productId: 10372,
            skuId: 36363
          },
          x: 30,
          y: 50,
          showOnDesktop: true,
          showOnMobile: true
        },
        {
          product: {
            productId: 10796,
            skuId: 38306
          },
          x: 50,
          y: 48,
          showOnDesktop: true,
          showOnMobile: true
        },
        {
          product: {
            productId: 10947,
            skuId: 39618
          },
          x: 75,
          y: 50,
          showOnDesktop: true,
          showOnMobile: true
        }
      ],
      items: {
        title: 'Hotspot',
        type: 'object',
        properties: {
          product: {
            title: 'Product Info',
            type: 'object',
            properties: {
              productId: {
                title: 'Product ID',
                type: 'number',
                description: 'ID del producto a mostrar en este hotspot',
              },
              skuId: {
                title: 'Initial SKU ID',
                type: 'number',
                description: 'SKU inicial del producto (opcional, se seleccionará automáticamente si está vacío)',
              },
            },
            required: ['productId'], // Solo productId es requerido
          },
          x: {
            title: 'X Coordinate (%)',
            type: 'number',
            minimum: 0,
            maximum: 100,
            description: 'Horizontal position from left (0-100%)',
          },
          y: {
            title: 'Y Coordinate (%)',
            type: 'number',
            minimum: 0,
            maximum: 100,
            description: 'Vertical position from top (0-100%)',
          },
          showOnDesktop: {
            title: 'Show on Desktop',
            type: 'boolean',
            default: true,
          },
          showOnMobile: {
            title: 'Show on Mobile',
            type: 'boolean',
            default: true,
          },
        },
        required: ['product', 'x', 'y'],
      },
    },
  },
  required: ['mainImageDK', 'mainImageMB'],
}

export default ShoppableImage
