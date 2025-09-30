import React, { useEffect, useState } from 'react'
// @ts-ignore
import { SliderLayout } from 'vtex.slider-layout'

import styles from './styles.css'

// Define proper types
interface ProductImage {
  ImageUrl: string
}

interface SliderImageProductPDPProps {
  productImages: ProductImage[]
  skuId: string
}

const SliderImageProductPDP = ({
  productImages,
  skuId
}: SliderImageProductPDPProps) => {
  const [images, setImages] = useState<ProductImage[]>([])

  useEffect(() => {
    setImages(productImages || [])
  }, [productImages])

  return (
    <>
      <SliderLayout
        key={skuId}
        itemsPerPage={{
          desktop: 1,
          tablet: 1,
          mobile: 1,
        }}
        infinite
        showNavigationArrows="always"
        showPaginationDots="always"
      >
        {images?.length ? (
          images.map((image: ProductImage, index: number) => (
            <div key={index} className={styles['image-product']}>
              <img src={image.ImageUrl} alt={`Product ${index + 1}`} />
            </div>
          ))
        ) : (
          <div className={styles['image-product']}>
            <img src="./No_Image_Available.jpg" alt="Imagen no disponible" />
          </div>
        )}
      </SliderLayout>
    </>
  )
}

export default SliderImageProductPDP
