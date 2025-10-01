import React, { useState, useMemo } from 'react'
import useCollections from '../../hooks/useCollections'
import { ProductGroupProps } from './typings'
import styles from './styles.css'
import { useCartActions } from '../../hooks/useCartActions'
import type { Variation, Sku } from '../../typings/variation'
import { Progress } from 'vtex.styleguide'
import ProductSelectionModal from './ProductSelectionModal'
import { useCartSimulation } from '../../hooks/useCartSimulation'
import type { CartSKU } from '../../typings/product'

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

const transformImageUrl = (imageUrl: string, width: number = 400) => {
  const url = new URL(imageUrl)
  const imageId = url.pathname.match(/\/ids\/(\d+)/)?.[1]
  if (!imageId) return imageUrl

  const version =
    new Date().toISOString().replace(/[-:T]/g, '').slice(0, 8) + '0000'
  const baseUrl = `${url.protocol}//${url.host}`

  return `${baseUrl}/arquivos/ids/${imageId}-${width}-auto?v=${version}&width=${width}&height=auto&aspect=true`
}

const getOrdinalPosition = (index: number): string => {
  const ordinals = ['primer', 'segundo', 'tercer']
  return ordinals[index] || `${index + 1}º`
}

interface SelectedProduct {
  collectionIndex: number
  product: Variation
  sku: Sku
}

const ProductGroup: StorefrontFunctionComponent<ProductGroupProps> = ({
  collectionIds = [],
}) => {
  const { collections, loading, error } = useCollections(collectionIds)
  const { addProductsToCart, isAdding } = useCartActions()

  const [selectedProducts, setSelectedProducts] = useState<{
    [collectionIndex: number]: SelectedProduct
  }>({})
  const [modalState, setModalState] = useState<{
    isOpen: boolean
    collectionIndex: number | null
  }>({
    isOpen: false,
    collectionIndex: null,
  })

  const openModal = (collectionIndex: number) => {
    setModalState({ isOpen: true, collectionIndex })
  }

  const closeModal = () => {
    setModalState({ isOpen: false, collectionIndex: null })
  }

  const handleProductSelection = (
    collectionIndex: number,
    product: Variation,
    sku: Sku
  ) => {
    setSelectedProducts((prev) => ({
      ...prev,
      [collectionIndex]: { collectionIndex, product, sku },
    }))
  }
  const handleRemoveProduct = (collectionIndex: number) => {
    setSelectedProducts((prev) => {
      const newProducts = { ...prev }
      delete newProducts[collectionIndex]
      return newProducts
    })
  }
  const handleAddToCart = async () => {
    const productsToAdd = Object.values(selectedProducts)
    if (productsToAdd.length === 0) return

    const itemsToAdd = productsToAdd.map((item) => ({
      itemId: item.sku.sku.toString(),
      quantity: 1,
      price: item.sku.bestPrice,
      name: item.sku.skuname,
      imageUrl: item.sku.image,
    }))

    await addProductsToCart(itemsToAdd)
  }

  const cartSkus: CartSKU[] = useMemo(() => {
    return Object.values(selectedProducts).map(item => ({
      itemId: item.sku.sku.toString(),
      price: item.sku.bestPrice,
      sellerId: '1'
    }))
  }, [selectedProducts])

  const { regularTotal, discountedTotal, discountPercentage, loading: simulationLoading } = useCartSimulation(cartSkus)

  if (loading) {
    return (
      <div className={styles.productGroupContainer}>
        <Progress type="steps" steps={['inProgress']} />
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.productGroupContainer}>
        <p>Error al cargar las colecciones.</p>
      </div>
    )
  }

  if (!collections || collections.length === 0) {
    return null
  }

  return (
    <div className={styles.productGroupContainer}>
      <div className={styles['content-titles']}>
        <h2 className={styles.Subtitle}>Compra el look</h2>
        <h3 className={styles.Highlight}>
          Selecciona tus productos y arma tu look soñado
        </h3>
      </div>

      <div className={styles['collections-grid']}>
        {collections.map((_, index) => {
          const selectedProduct = selectedProducts[index]
          const hasSelection = !!selectedProduct

          return (
            <div
              key={index}
              className={`${styles['collection-card']} ${
                hasSelection ? styles['collection-card-selected'] : ''
              }`}
            >
              {hasSelection ? (
                <>
                  <div className={styles['selected-product-image']}>
                    <img
                      src={transformImageUrl(selectedProduct.sku.image, 400)}
                      alt={selectedProduct.product.name}
                    />
                    <button
                      className={styles['change-product-button']}
                      onClick={() => openModal(index)}
                    >
                      Cambiar producto
                    </button>
                  </div>
                </>
              ) : (
                <div className={styles['content-select-product']}>
                  <img src="https://oneillco.vteximg.com.br/arquivos/product-not-selected.svg" alt="product-not-selected"/>

                  <button
                    className={styles['select-product-button']}
                    onClick={() => openModal(index)}
                  >
                    Seleccionar producto
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {Object.keys(selectedProducts).length > 0 ? (
        <div className={styles['cart-section']}>
          <div className={styles['price']}>
            <span>Precio antes: {formatPrice(regularTotal)}</span>
          </div>
          {discountPercentage && discountPercentage > 0 && (
            <div className={styles['discount']}>
              <span>Descuento Kit: {discountPercentage}% ({formatPrice(regularTotal - (discountedTotal || 0))})</span>
            </div>
          )}
          <div className={styles['total-price']}>
            <span>Total: </span>
            <strong>{formatPrice(discountedTotal || regularTotal)}</strong>
          </div>
          <button
            className={`${styles['add-to-cart-button']} ${
              isAdding ? styles['add-to-cart-loading'] : ''
            }`}
            onClick={handleAddToCart}
            disabled={isAdding || simulationLoading}
          >
            {isAdding ? 'Agregando...' : 'Agregar al carrito'}
          </button>
        </div>
      ) : (
        <div className={styles['cart-section']}>
          <div className={styles['empty-cart-message']}>
            <span>Selecciona tus productos para realizar tu compra</span>
          </div>
        </div>
      )}

      {modalState.isOpen && modalState.collectionIndex !== null && (
        <ProductSelectionModal
          isOpen={modalState.isOpen}
          onClose={closeModal}
          products={collections[modalState.collectionIndex]}
          ordinalPosition={getOrdinalPosition(modalState.collectionIndex)}
          onSelectProduct={(product, sku) =>
            handleProductSelection(modalState.collectionIndex!, product, sku)
          }
          onRemoveProduct={() => handleRemoveProduct(modalState.collectionIndex!)}
          currentSelectedProduct={
            selectedProducts[modalState.collectionIndex]
              ? {
                product: selectedProducts[modalState.collectionIndex].product,
                sku: selectedProducts[modalState.collectionIndex].sku,
              }
              : undefined
          }
        />
      )}
    </div>
  )
}

ProductGroup.schema = {
  title: 'Product Group',
  description: 'A group of products to be bought together from collections.',
  type: 'object',
  properties: {
    collectionIds: {
      title: 'Collection IDs',
      type: 'array',
      items: {
        title: 'Collection ID',
        type: 'number',
        default: 226,
      },
    },
  },
}

export default ProductGroup
