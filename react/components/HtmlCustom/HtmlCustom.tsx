import React, { useEffect, useState } from 'react'

import styles from './styles.css'
// @ts-ignore
import Group445 from './Group-429.png'

// Suks: 33574, 36363, 38306, 39618

const HtmlCustom = () => {
  const dataProducts = [
    {
      id: 1,
      name: "Panty 'fila' tipo brasilera invisible en algodón",
      price: '$21.900',
      size: 'S',
      color: 'beige',
      image:
        'https://lilipinkco.vtexassets.com/assets/vtex.file-manager-graphql/images/01c08a87-ac53-4df4-837b-f335f70b4866___7fc3cc2bda5650b0feed3bcef0ded221.png',
    },
    {
      id: 2,
      name: 'Top con cargaderas amplias y tecnologia seamless',
      price: '$21.900',
      size: 'M',
      color: 'magenta',
      image:
        'https://lilipinkco.vtexassets.com/assets/vtex.file-manager-graphql/images/01c08a87-ac53-4df4-837b-f335f70b4866___7fc3cc2bda5650b0feed3bcef0ded221.png',
    },
    {
      id: 3,
      name: 'Leggins deportivo talle alto',
      price: '$44.900',
      size: 'L',
      color: 'black',
      image:
        'https://lilipinkco.vtexassets.com/assets/vtex.file-manager-graphql/images/01c08a87-ac53-4df4-837b-f335f70b4866___7fc3cc2bda5650b0feed3bcef0ded221.png',
    },
    {
      id: 4,
      name: 'Medias fila para mujer tobillera paquete x3 en algodón',
      price: '$26.900',
      size: 'XL',
      color: 'white',
      image:
        'https://lilipinkco.vtexassets.com/assets/vtex.file-manager-graphql/images/01c08a87-ac53-4df4-837b-f335f70b4866___7fc3cc2bda5650b0feed3bcef0ded221.png',
    },
  ]

  const [productList, setProductList] = useState<any>([])

  // Función para verificar si un producto está en la lista
  const isProductInList = (productId: number) => {
    return productList.some((product: any) => product.id === productId)
  }

  // Función para agregar producto a la lista
  const addProductList = (product: any) => {
    setProductList([...productList, product])
  }

  // Función para quitar producto de la lista
  const removeProductFromList = (productId: number) => {
    setProductList(
      productList.filter((product: any) => product.id !== productId)
    )
  }

  console.log({ dataProducts })
  useEffect(() => {
    console.log({ productList })
  }, [productList])

  return (
    <>
      <div className={styles['content-Shop-the-look']}>
        <div className={styles['content-titles']}>
          <h3>Compra el look</h3>
          <p>Selecciona tus productos y arma tu look soñado</p>
        </div>
        <div className={styles['Shop-the-look']}>
          {dataProducts.map((data: any) => {
            const productInList = isProductInList(data.id)

            return (
              <div
                key={data.id}
                className={`${styles['product-card']} ${
                  productInList ? styles.active : ''
                }`}
              >
                <div className={styles['content-info-product']}>
                  <div className={styles['product-image']}>
                    <img src={data.image} alt={data.name} />
                  </div>
                  <div className={styles['product-info']}>
                    <h3 className={styles['product-title']}> {data.name}</h3>
                    <div className={styles['product-price']}>{data.price}</div>
                    <div className={styles['options-section']}>
                      <div className={styles['options-label']}>Talla</div>
                      <div className={styles['size-options']}>
                        <button
                          className={`${styles['size-btn']}  ${
                            data.size === 'S' && styles.active
                          }`}
                        >
                          S
                        </button>
                        <button
                          className={`${styles['size-btn']}  ${
                            data.size === 'M' && styles.active
                          }`}
                        >
                          M
                        </button>
                        <button
                          className={`${styles['size-btn']}  ${
                            data.size === 'L' && styles.active
                          }`}
                        >
                          L
                        </button>
                        <button
                          className={`${styles['size-btn']}  ${
                            data.size === 'XL' && styles.active
                          }`}
                        >
                          XL
                        </button>
                      </div>
                    </div>
                    <div className={styles['options-section']}>
                      <div className={styles['options-label']}>Color</div>
                      <div className={styles['color-options']}>
                        <button
                          className={`${styles['color-btn']} ${styles.beige} ${
                            data.color === 'beige' && styles.active
                          }`}
                        />
                        <button
                          className={`${styles['color-btn']} ${
                            styles.magenta
                          } ${data.color === 'magenta' && styles.active}`}
                        />
                        <button
                          className={`${styles['color-btn']} ${styles.black} ${
                            data.color === 'black' && styles.active
                          }`}
                        />
                        <button
                          className={`${styles['color-btn']} ${styles.white} ${
                            data.color === 'white' && styles.active
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  className={`${styles['action-btn']} ${
                    productInList ? styles['remove-btn'] : styles['add-btn']
                  }`}
                  onClick={() =>
                    productInList
                      ? removeProductFromList(data.id)
                      : addProductList(data)
                  }
                >
                  {productInList ? 'Quitar del kit' : 'Agregar al kit'}
                </button>
              </div>
            )
          })}
        </div>

        <div className={styles['look-price-buy']}>
          <img src={Group445} alt="Group429" />
          <div className={styles['look-price']}>
            <span className={styles['price-total']}>
              Total a pagar: $98.640
            </span>
            <span className={styles['price-saved']}>
              Estas ahorrando: <span>$10.946</span>
            </span>
            <span className={styles['price-regular']}>
              Precio regular: <span>$109.600</span>
            </span>
          </div>
          <button className={styles['buy-button']}>{'¡Lo quiero todo!'}</button>
        </div>
      </div>
    </>
  )
}

export default HtmlCustom
