import React, { useEffect, useState, useMemo } from 'react'
import useProductVariations from '../../hooks/useProductVariations'
import { ProductGroupProps } from './typings'
import styles from './styles.css'
import ImageSummary from '../ImageSummary'
import { useCartActions } from '../../hooks/useCartActions'
import { useCartSimulation } from '../../hooks/useCartSimulation'
import type { CartSKU } from '../../typings/product'
import type { Sku } from '../../typings/variation'
import SkuSelector from '../SkuSelector'
import { Progress } from 'vtex.styleguide'

// Helper to format price
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

const transformImageUrl = (imageUrl: string, width: number = 800) => {
  const url = new URL(imageUrl)
  const imageId = url.pathname.match(/\/ids\/(\d+)/)?.[1]
  if (!imageId) return imageUrl

  const version = (new Date().toISOString().replace(/[-:T]/g, '').slice(0, 8)) + '0000';
  const baseUrl = `${url.protocol}//${url.host}`

  return `${baseUrl}/arquivos/ids/${imageId}-${width}-auto?v=${version}&width=${width}&height=auto&aspect=true`
}

const ProductGroup: StorefrontFunctionComponent<ProductGroupProps> = ({
  productsAndSkuIds = [],
}) => {
  const productsToShow = useMemo(() => {
    const validationRegex = /^\d+-\d+$/
    const validProducts = productsAndSkuIds.filter((item) =>
      validationRegex.test(item)
    )

    if (validProducts.length < 3) {
      return []
    }

    return validProducts.length > 4
      ? validProducts.slice(0, 4)
      : validProducts
  }, [productsAndSkuIds])

  if (productsToShow.length === 0) {
    return null
  }

  const { addProductsToCart, isAdding } = useCartActions()

  const { productIds, initialSkuIds } = useMemo(() => {
    const pIds: number[] = []
    const sIds: { [key: number]: number } = {}
    productsToShow.forEach((item: string) => {
      const [pId, sId] = item.split('-').map(Number)
      if (pId && sId) {
        pIds.push(pId)
        sIds[pId] = sId
      }
    })
    return { productIds: pIds, initialSkuIds: sIds }
  }, [productsToShow])

  const { variations, loading, error } = useProductVariations(productIds)
  const [selectedSkus, setSelectedSkus] = useState<{ [key: number]: Sku }>({})

  useEffect(() => {
    if (variations.length > 0) {
      const initialSelections: { [key: number]: Sku } = {}
      variations.forEach((variation) => {
        if (variation) {
          const initialSkuId = initialSkuIds[variation.productId]
          let skuToSelect = variation.skus.find(
            (s) => s.sku === initialSkuId && s.available
          )

          if (!skuToSelect) {
            skuToSelect = variation.skus.find((s) => s.available) ?? variation.skus[0]
          }
          initialSelections[variation.productId] = skuToSelect
        }
      })
      setSelectedSkus(initialSelections)
    }
  }, [variations, initialSkuIds])

  const [productList, setProductList] = useState<Sku[]>([])

  useEffect(() => {
    if (Object.keys(selectedSkus).length > 0) {
      const allSelectedSkus = Object.values(selectedSkus)
      setProductList(allSelectedSkus)
    }
  }, [selectedSkus])

  const cartSimulationProducts: CartSKU[] = useMemo(() => {
    return productList.map((sku) => ({
      itemId: sku.sku.toString(),
      price: sku.bestPrice,
      sellerId: sku.sellerId,
    }))
  }, [productList])

  const { regularTotal, discountedTotal, discountPercentage, loading: simulationLoading } = useCartSimulation(
    cartSimulationProducts
  )

  const currentTotalPrice = discountedTotal ?? regularTotal
  const currentRegularPrice = regularTotal
  const currentSavedPrice = currentRegularPrice - currentTotalPrice
  const showSavedPrice = currentSavedPrice > 0

  const isProductInList = (productId: number) => {
    const sku = selectedSkus[productId]
    return productList.some((pSku) => pSku.sku === sku?.sku)
  }

  const toggleProductInList = (productId: number) => {
    const sku = selectedSkus[productId]
    if (!sku) return

    if (isProductInList(productId)) {
      setProductList((prev) => prev.filter((pSku) => pSku.sku !== sku.sku))
    } else {
      setProductList((prev) => [...prev, sku])
    }
  }

  const handleSkuChange = (productId: number, newSku: Sku) => {
    // Si el producto estaba en la lista, actualizamos el sku en la lista
    if (isProductInList(productId)) {
      setProductList(prev => prev.map(pSku => pSku.sku === selectedSkus[productId].sku ? newSku : pSku))
    }
    setSelectedSkus((prev) => ({ ...prev, [productId]: newSku }))
  }

  const handleAddToCart = async () => {
    if (productList.length === 0) return

    const itemsToAdd = productList.map((sku) => ({
      itemId: sku.sku.toString(),
      quantity: 1,
      price: sku.bestPrice,
      name: sku.skuname,
      imageUrl: sku.image,
    }))

    await addProductsToCart(itemsToAdd)
  }

  if (loading) return <div className={styles.productGroupContainer}><Progress type="steps" danger steps={['inProgress']} /></div>
  if (error) return <div className={styles.productGroupContainer}><p>Error loading products.</p></div>
  if (!variations || variations.length === 0) return <></>
  const imageUrls = productList.map((sku) => sku.image).map(url => transformImageUrl(url, 100))

  return (
    <div className={styles.productGroupContainer}>
      <div className={styles['content-titles']}>
        <h2 className={styles.Subtitle}>Compra el look</h2>
        <h3 className={styles.Highlight}>Selecciona tus productos y arma tu look soñado</h3>
      </div>
      <div className={styles['Shop-the-look']}>
        {variations.map((variation) => {
          if (!variation) return null

          const selectedSku = selectedSkus[variation.productId]
          if (!selectedSku) return null // Or a placeholder

          const productInList = isProductInList(variation.productId)

          return (
            <div
              key={variation.productId}
              className={`${styles['product-card']} ${
                productInList ? styles.active : ''
              }`}>
              <div className={styles['content-info-product']}>
                <div className={styles['product-image']}>
                  <img
                    src={transformImageUrl(selectedSku.image, 800)}
                    alt={variation.name}
                  />
                </div>
                <div className={styles['product-info']}>
                  <h3 className={styles['product-title']}>{variation.name}</h3>
                  <div className={styles['product-price']}>
                    {formatPrice(selectedSku.bestPrice / 100)}
                  </div>
                  <SkuSelector
                    variation={variation}
                    selectedSku={selectedSku}
                    onSkuChange={(newSku) => handleSkuChange(variation.productId, newSku)}
                  />
                </div>
              </div>
              <button
                className={`${styles['action-btn']} ${
                  productInList ? styles['remove-btn'] : styles['add-btn']
                }`}
                onClick={() => toggleProductInList(variation.productId)}
                disabled={simulationLoading}
              >
                {productInList ? 'Quitar del kit' : 'Agregar al kit'}
              </button>
            </div>
          )
        })}
      </div>

      {productList.length > 0 ? (
        <div className={styles['look-price-buy']}>
          <ImageSummary imageUrls={imageUrls} />
          <div className={styles['look-price']}>
            <span className={styles['price-total']}>
              Total a pagar: {formatPrice(currentTotalPrice)}
            </span>
            {showSavedPrice && (
              <span className={styles['price-saved']}>
                Estas ahorrando: <span>{formatPrice(currentSavedPrice)} {discountPercentage && `(${discountPercentage}%)`}</span>
              </span>
            )}
            {showSavedPrice && (
              <span className={styles['price-regular']}>
                Precio regular: <span>{formatPrice(currentRegularPrice)}</span>
              </span>
            )}
          </div>
          <button
            className={`${styles['buy-button']} ${
              isAdding ? styles['buy-button-loading'] : ''
            }`}
            onClick={handleAddToCart}
            disabled={simulationLoading || isAdding}>
            {'¡Lo quiero todo!'}
            {isAdding && <div className={styles['loading-bar']} />}
          </button>
        </div>
      ) : (
        <div className={styles['empty-kit-message']}>
          <p>Selecciona productos para armar tu kit y llévatelo hoy mismo.</p>
        </div>
      )}
    </div>
  )
}

ProductGroup.schema = {
  title: 'Product Group',
  description: 'A group of products to be bought together.',
  type: 'object',
  properties: {
    productsAndSkuIds: {
      title: 'Product and initial SKU IDs',
      type: 'array',
      items: {
        title: 'Product-SKU ID',
        type: 'string',
        default: '1087-4333',
      },
    },
  },
}

export default ProductGroup
