import { UserInputError } from '@vtex/api'
import { getAppSettings } from '../utils/credentials'

export async function getProductSkus(ctx: Context, next: () => Promise<any>) {
  const { clients, vtex } = ctx
  const { logger } = vtex
  const { productId } = vtex.route.params as { productId: string }

  if (!productId) {
    throw new UserInputError('Missing productId query parameter')
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

    const variations = await skusClient.getProductVariationsById(productId)
    const skuIds = variations.skus.map((sku: any) => sku.sku)

    const skuDetailsPromises = skuIds.map((skuId: string) =>
      skusClient.getSkuById(skuId)
    )

    const skuDetails = await Promise.all(skuDetailsPromises)

    ctx.status = 200
    ctx.body = skuDetails
    ctx.set('Cache-Control', 'public, max-age=3600')

    await next()
  } catch (error) {
    logger.error({ message: 'get-product-skus-handler-error', error })
    ctx.status = 500
    ctx.body = { message: 'Internal Server Error' }
  }
}
