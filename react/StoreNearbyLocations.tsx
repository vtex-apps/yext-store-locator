import React from 'react'
import { useLazyQuery } from 'react-apollo'
import { useCssHandles } from 'vtex.css-handles'
import { defineMessages } from 'react-intl'

import GET_STORES from './queries/getStores.graphql'
import StoreLink from './components/StoreLink'
import { useStoreGroup } from './StoreGroup'
import { StoresResult } from './typings/store'

const CSS_HANDLES = [
  'nearbyLocationsBlock',
  'nearbyLocationsTitle',
  'nearbyLocationsContainer',
  'nearbyLocationsItem',
  'nearbyLocationsAddress',
  'nearbyLocationsLinkContainer',
  'nearbyLocationsLink',
] as const

const StoreNearbyLocations: StorefrontFunctionComponent = () => {
  const handles = useCssHandles(CSS_HANDLES)
  const group = useStoreGroup()

  const [getStores, { data, loading, called }] = useLazyQuery<StoresResult>(
    GET_STORES
  )

  if (!group) {
    return null
  }

  if (!called) {
    // Filter current location and locations tagged as closed
    const currentStoreFilter = `{"meta.id":{"!$eq":"${group.id}"},"closed":{"$eq":false}}`

    getStores({
      variables: {
        filter: currentStoreFilter,
        location: group.address.postalCode,
        limit: 2,
      },
    })
  }

  const today = new Date().getDay()
  const hours = group.businessHours.find((e) => e.dayOfWeek === today)
  const closingTime = hours?.closingTime

  const closingMessage = closingTime
    ? `Open Until ${closingTime}`
    : 'Closed today'

  if (called && data && !loading) {
    return (
      <div className={`${handles.nearbyLocationsBlock} mv6`}>
        <div className={`${handles.nearbyLocationsTitle} tc t-heading-3 mb6`}>
          Nearby {group.name} Stores
        </div>
        <div
          className={`${handles.nearbyLocationsContainer} flex items-center justify-center`}
        >
          {data.getStores.items.map((item, i) => (
            <div className={`${handles.nearbyLocationsItem} ma6`} key={i}>
              <StoreLink item={item} />

              <span className={`${handles.nearbyLocationsAddress} t-small`}>
                <div className="mv2 b">{closingMessage}</div>
                <div>{item.address.street}</div>
                <div>{`${item.address.city}, ${item.address.state} ${item.address.postalCode}`}</div>
              </span>

              <div
                className={`${handles.nearbyLocationsLinkContainer} flex mt3`}
              >
                <div className="mr6">
                  <a
                    className={handles.nearbyLocationsLink}
                    href={`tel:${item.mainPhone}`}
                  >
                    {item.mainPhone}
                  </a>
                </div>
                <div className="ml5">
                  <a
                    className={handles.nearbyLocationsLink}
                    href={item.googleMapLink}
                  >
                    Get Directions
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return null
}

const messages = defineMessages({
  title: {
    defaultMessage: '',
    id: 'admin/editor.storeNearbyLocations.title',
  },
  description: {
    defaultMessage: '',
    id: 'admin/editor.storeNearbyLocations.description',
  },
})

StoreNearbyLocations.schema = {
  title: messages.title.id,
  description: messages.description.id,
  type: 'object',
}

export default StoreNearbyLocations
