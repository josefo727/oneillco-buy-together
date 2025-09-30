interface ProductInfo {
  productId: number
  skuId: number
}
export interface Hotspot {
  product: ProductInfo
  x: number
  y: number
  showOnDesktop?: boolean
  showOnMobile?: boolean
}
export interface ShoppableImageProps {
  title: string
  mainImageDK: string
  mainImageMB: string
  hotspotsCoordinates: Hotspot[]
}
