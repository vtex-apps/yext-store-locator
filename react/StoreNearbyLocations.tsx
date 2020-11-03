import React, { useContext } from 'react'
import { useLazyQuery } from 'react-apollo'
import { useCssHandles } from 'vtex.css-handles'
import { defineMessages } from 'react-intl'

import GET_STORES from './queries/getStores.graphql'
import StoreLink from './components/StoreLink'
import { StoreGroupContext } from './contexts/StoreGroupContext'
import { StoresResult } from './typings/store'
import { getClosingTime } from './getClosingTime'

const CSS_HANDLES = [
  'nearbyLocationsBlock',
  'nearbyLocationsTitle',
  'nearbyLocationsContainer',
  'nearbyLocationsItem',
  'nearbyLocationsAddress',
  'nearbyLocationsLinkContainer',
  'nearbyLocationsPhoneLink',
  'nearbyLocationsDirectionsLink',
] as const

const StoreNearbyLocations: StorefrontFunctionComponent = () => {
  const handles = useCssHandles(CSS_HANDLES)
  const group = useContext(StoreGroupContext)

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

  const closingTime = getClosingTime(group)
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
            <div className={`${handles.nearbyLocationsItem} mb6 mh6`} key={i}>
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
                    className={`${handles.nearbyLocationsPhoneLink} vtex-link`}
                    href={`tel:${item.mainPhone}`}
                  >
                    {item.mainPhone}
                  </a>
                </div>
                <div className="b">
                  <a
                    className={`${handles.nearbyLocationsDirectionsLink} vtex-link`}
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
