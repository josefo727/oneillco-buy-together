import React, { useState } from 'react'
import useCollections from '../../hooks/useCollections'
import { ProductGroupProps } from './typings'
import styles from './styles.css'
import { useCartActions } from '../../hooks/useCartActions'
import type { Variation, Sku } from '../../typings/variation'
import { Progress } from 'vtex.styleguide'
import ProductSelectionModal from './ProductSelectionModal'

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

  const totalPrice = Object.values(selectedProducts).reduce(
    (sum, item) => sum + item.sku.bestPrice,
    0
  )

  if (loading) {
    return (
      <div className={styles.productGroupContainer}>
        <Progress type="steps" danger steps={['inProgress']} />
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

      {Object.keys(selectedProducts).length > 0 ?
        <div className={styles['cart-section']}>
          <div className={styles['price']}>
            <span>Precio antes: $149.900* </span>
          </div>
          <div className={styles['discount']}>
            <span>Descuento Kit: $000.000.000</span>
          </div>
          <div className={styles['total-price']}>
            <span>Total: </span>
            <strong>{formatPrice(totalPrice / 100)}</strong>
          </div>
          <button
            className={`${styles['add-to-cart-button']} ${
              isAdding ? styles['add-to-cart-loading'] : ''
            }`}
            onClick={handleAddToCart}
            disabled={isAdding}
          >
            {isAdding ? 'Agregando...' : 'Agregar al carrito'}
          </button>
        </div>
        :
        <div className={styles['cart-section']}>
          <div className={styles['price']}>
            <span>Precio antes: $000.000.000 </span>
          </div>
          <div className={styles['discount']}>
            <span>Descuento Kit: $000.000.000</span>
          </div>
          <div className={styles['empty-price']}>
            <span>Total: </span>
            <strong>$000.000.000</strong>
          </div>
          <button
            className={styles['add-to-cart-disabled']}
            disabled={true}
          >
            Agregar kit al carrito
          </button>
        </div>
      }

      {modalState.isOpen && modalState.collectionIndex !== null && (
        <ProductSelectionModal
          isOpen={modalState.isOpen}
          onClose={closeModal}
          products={collections[modalState.collectionIndex]}
          ordinalPosition={getOrdinalPosition(modalState.collectionIndex)}
          onSelectProduct={(product, sku) =>
            handleProductSelection(modalState.collectionIndex!, product, sku)
          }
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
