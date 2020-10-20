/* eslint-disable @typescript-eslint/no-explicit-any */
import { method } from '@vtex/api'
import slugify from 'slugify'

import { Entity, EntityCustomFields } from '../typings/yextLocations'

const DAY = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
} as const

const buildMapLink = (entity: Entity) => {
  const {
    name,
    address: { line1, city, region, postalCode },
  } = entity

  const mapAddress = encodeURI(
    `${name},${line1},${city},${region},${postalCode}`
  )

  return `https://www.google.com/maps/dir/?api=1&destination=${mapAddress}`
}

const formatBusinessHours = (entity: Entity) => {
  const businessHours = Object.keys(entity.hours).map((key) => {
    const hours = entity.hours[key as keyof typeof DAY].openIntervals

    return {
      dayOfWeek: DAY[key as keyof typeof DAY],
      openingTime: hours ? hours[0].start : null,
      closingTime: hours ? hours[0].end : null,
    }
  })

  return businessHours
}

const mapCustomFields = (entity: EntityCustomFields) => {
  const customFields = Object.keys(entity).reduce(
    (result: any, key) => {
      if (key.substr(0, 2) === 'c_') {
        const customField = entity[key]

        if (typeof customField === 'object') {
          if (typeof customField[0] === 'string') {
            result.textList.push({ id: key, data: entity[key] })
          } else if (typeof customField[0] === 'object') {
            result.imageList.push({ id: key, data: entity[key] })
          } else {
            const { image } = entity[key]

            result.image.push({ id: key, data: image })
          }
        } else if (typeof customField === 'string') {
          result.text.push({ id: key, data: entity[key] })
        }
      }

      return result
    },
    { text: [], textList: [], image: [], imageList: [] }
  )

  return customFields
}

const Slugify = (str: string) => {
  return slugify(str, { lower: true, remove: /[*+~.()'"!:@]/g })
}

export const resolvers = {
  Routes: {
    getSitemap: [
      method({
        GET: async (ctx: Context) => {
          try {
            const stores: any = await resolvers.Query.getStores(
              null,
              { location: null, limit: 50 },
              ctx
            )

            ctx.set('Content-Type', 'text/xml')

            const lastMod = new Date().toISOString()
            const storesMap = `
              <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
                ${stores?.items
                  .map((item: any) => {
                    return `<url>
                  <loc>https://${ctx.vtex.host}/store/${Slugify(
                      `${item.name} ${item.address.state} ${item.address.postalCode}`
                    )}/${String(item.id).replace('1_', '')}</loc>
                  <lastmod>${lastMod}</lastmod>
                  <changefreq>daily</changefreq>
                  <priority>0.8</priority>
               </url>`
                  })
                  .join('')}
              </urlset>`

            ctx.body = storesMap
            ctx.status = 200
          } catch (e) {
            ctx.body = e
            ctx.status = 500
          }
        },
      }),
    ],
  },
  Query: {
    getStoreSchema: async (_: any, param: any, ctx: Context) => {
      const { locationId } = param
      const {
        clients: { apps, yext },
      } = ctx

      const appId = process.env.VTEX_APP_ID as string
      const settings = await apps.getAppSettings(appId)

      const { response } = await yext.getStructuredData({
        apiKey: settings.apiKey,
        locationId,
      })

      return { response: JSON.stringify(response) }
    },
    getStores: async (_: any, param: any, ctx: Context) => {
      const { location, limit, filter } = param
      const {
        clients: { apps, yext },
      } = ctx

      const appId = process.env.VTEX_APP_ID as string
      const settings = await apps.getAppSettings(appId)

      const { response } = await yext.getLocationsByAddress({
        apiKey: settings.apiKey,
        location: location || settings.defaultLocation || 85251,
        limit,
        radius: 2500,
        filter,
      })

      if (!response?.entities) {
        return []
      }

      const locations = {
        items: response.entities.map((entity) => {
          return {
            id: entity.meta.id,
            name: entity.name,
            mainPhone: entity.mainPhone,
            address: {
              postalCode: entity.address.postalCode,
              country: entity.address.countryCode,
              city: entity.address.city,
              state: entity.address.region,
              neighborhood: null,
              street: entity.address.line1,
              number: null,
              complement: null,
              reference: null,
              location: {
                latitude: entity.cityCoordinate.latitude,
                longitude: entity.cityCoordinate.longitude,
              },
            },
            businessHours: formatBusinessHours(entity),
            googleMapLink: buildMapLink(entity),
          }
        }),
        location: {
          latitude: response.geo.coordinate.latitude,
          longitude: response.geo.coordinate.longitude,
        },
      }

      return locations
    },
    getStore: async (_: any, param: any, ctx: Context) => {
      const { locationId } = param
      const {
        clients: { apps, yext },
      } = ctx

      const appId = process.env.VTEX_APP_ID as string
      const settings = await apps.getAppSettings(appId)

      const { response: entity } = await yext.getLocation({
        apiKey: settings.apiKey,
        locationId,
      })

      if (!entity) {
        return null
      }

      const location = {
        item: {
          id: entity.meta.id,
          name: entity.name,
          description: entity.description,
          logo: entity.logo,
          mainPhone: entity.mainPhone,
          emails: entity.emails,
          address: {
            postalCode: entity.address.postalCode,
            country: entity.address.countryCode,
            city: entity.address.city,
            state: entity.address.region,
            neighborhood: null,
            street: entity.address.line1,
            number: null,
            complement: null,
            reference: null,
            geoCoordinates: [
              entity.cityCoordinate.longitude,
              entity.cityCoordinate.latitude,
            ],
            location: {
              latitude: entity.cityCoordinate.latitude,
              longitude: entity.cityCoordinate.longitude,
            },
          },
          businessHours: formatBusinessHours(entity),
          googleMapLink: buildMapLink(entity),
          brands: entity.brands,
          paymentOptions: entity.paymentOptions,
          twitterHandle: entity.twitterHandle,
          facebookPageUrl: entity.facebookPageUrl,
          instagramHandle: entity.instagramHandle,
          customFields: mapCustomFields(entity),
        },
      }

      return location
    },
  },
}
