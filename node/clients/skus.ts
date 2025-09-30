import { JanusClient } from '@vtex/api'

export default class SkusClient extends JanusClient {
  public async getSkuById(skuId: string): Promise<any> {
    return this.http.get(`/api/catalog_system/pvt/sku/stockkeepingunitbyid/${skuId}`)
  }

  public async getProductById(productId: string): Promise<any> {
    return this.http.get(`/api/catalog/pvt/product/${productId}`)
  }

  public async getProductVariationsById(productId: string): Promise<any> {
    return this.http.get(
      `/api/catalog_system/pub/products/variations/${productId}`
    )
  }

  public async getInventoryBySkuId(skuId: string): Promise<any> {
    return this.http.get(`/api/logistics/pvt/inventory/skus/${skuId}`)
  }

  public async getPriceBySkuId(skuId: string): Promise<any> {
    return this.http.get(`/api/pricing/prices/${skuId}`)
  }
}
