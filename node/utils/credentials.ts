import { Apps } from '@vtex/api'

export interface AppSettings {
  appKey: string
  appToken: string
}

export async function getAppSettings(apps: Apps): Promise<AppSettings> {
  const appId = process.env.VTEX_APP_ID ?? ''
  const settings = await apps.getAppSettings(appId)

  return {
    appKey: settings.appKey,
    appToken: settings.appToken,
  }
}
