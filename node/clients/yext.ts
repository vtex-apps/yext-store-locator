import { ExternalClient, InstanceOptions, IOContext } from '@vtex/api'

import {
  EntityApi,
  EntityListApi,
  GeoSearchApi,
} from '../typings/yextLocations'

interface GetLocationsArgs {
  apiKey: string
  limit: number
}

interface GetLocationArgs {
  apiKey: string
  locationId: string
}

interface GeoLocationsArgs extends GetLocationsArgs {
  apiKey: string
  location: string
  limit: number
  radius: number
  filter: string
}

const API_VERSION = '20201001'

export default class Yext extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super('https://liveapi.yext.com', context, options)
  }

  public async getLocationsByAddress({
    apiKey,
    location,
    limit,
    radius,
    filter,
  }: GeoLocationsArgs): Promise<GeoSearchApi> {
    const withFilter = filter ? `&filter=${encodeURIComponent(filter)}` : ''
    const endpoint = `/v2/accounts/me/entities/geosearch?api_key=${apiKey}&v=${API_VERSION}&location=${location})&resolvePlaceholders=true&entityTypes=location&radius=${radius}&limit=${limit}${withFilter}`

    return this.http.get(endpoint)
  }

  public async getLocations({
    apiKey,
    limit,
  }: GetLocationsArgs): Promise<EntityListApi> {
    const endpoint = `/v2/accounts/me/entities?api_key=${apiKey}&v=${API_VERSION}&entityTypes=location&limit=${limit}&resolvePlaceholders=true`

    return this.http.get(endpoint)
  }

  public async getLocation({
    apiKey,
    locationId,
  }: GetLocationArgs): Promise<EntityApi> {
    const endpoint = `/v2/accounts/me/entities/${locationId}?api_key=${apiKey}&v=${API_VERSION}&resolvePlaceholders=true`

    return this.http.get(endpoint)
  }

  public async getStructuredData({
    apiKey,
    locationId,
  }: GetLocationArgs): Promise<EntityApi> {
    const endpoint = `/v2/accounts/me/locations/${locationId}/schema?api_key=${apiKey}&v=${API_VERSION}&resolvePlaceholders=true`

    return this.http.get(endpoint)
  }
}
