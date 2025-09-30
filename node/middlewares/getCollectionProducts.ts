import { UserInputError } from '@vtex/api'
import { getAppSettings } from '../utils/credentials'

interface CollectionProduct {
  ProductId: number
  SkuId: number
  SubCollectionId: number
  Position: number
  ProductName: string
  SkuImageUrl: string
}

interface CollectionResponse {
  Page: number
  Size: number
  TotalRows: number
  TotalPage: number
  Data: CollectionProduct[]
}

export async function getCollectionProducts(ctx: Context, next: () => Promise<any>) {
  const { clients, vtex } = ctx
  const { logger } = vtex
  const { collectionId } = vtex.route.params as { collectionId: string }

  if (!collectionId) {
    throw new UserInputError('Missing collectionId query parameter')
  }

  try {
    const { appKey, appToken } = await getAppSettings(clients.apps)

    if (!appKey || !appToken) {
      logger.error({ message: 'App settings (appKey or appToken) are not configured.' })
      ctx.status = 500
      ctx.body = { message: 'App not configured.' }
      return
    }

    const skusClient = clients.getSkusClient(vtex, appKey, appToken)

    const collectionResponse: CollectionResponse = await skusClient.getCollectionProducts(collectionId)

    // Obtener ProductIds únicos
    const uniqueProductIds = [...new Set(collectionResponse.Data.map((item) => item.ProductId))]

    // Obtener variaciones de todos los productos en paralelo, manejando errores 404
    const variationsPromises = uniqueProductIds.map(async (productId) => {
      try {
        return await skusClient.getProductVariationsById(String(productId))
      } catch (error: any) {
        // Si el producto no existe (404) o cualquier otro error, retornar null
        logger.warn({
          message: 'Product not found or error fetching variations',
          productId,
          error: error.message
        })
        return null
      }
    })

    const allVariations = (await Promise.all(variationsPromises)).filter((variation) => variation !== null)

    // Filtrar productos y SKUs activos
    const activeProducts = allVariations
      .filter((variation) => variation.skus && variation.skus.length > 0)
      .map((variation) => ({
        ...variation,
        skus: variation.skus.filter((sku: any) => sku.available),
      }))
      .filter((product) => product.skus.length > 0)

    ctx.status = 200
    ctx.body = activeProducts
    ctx.set('Cache-Control', 'public, max-age=3600')

    await next()
  } catch (error) {
    logger.error({ message: 'get-collection-products-handler-error', error })
    ctx.status = 500
    ctx.body = { message: 'Internal Server Error' }
  }
}
