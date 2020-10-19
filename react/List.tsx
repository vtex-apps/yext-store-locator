/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { graphql, compose, useLazyQuery } from 'react-apollo'
import { Spinner } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'

import { StoresResult } from './typings/store'
import ORDER_FORM from './queries/orderForm.graphql'
import GET_STORES from './queries/getStores.graphql'
import GOOGLE_KEYS from './queries/GetGoogleMapsKey.graphql'
import Listing from './components/Listing'
import Pinpoints from './components/Pinpoints'

interface ListState {
  allLoaded: boolean
  center: number[] | null
  zoom: number
}

const CSS_HANDLES = [
  'container',
  'storesListCol',
  'storesList',
  'storesMapCol',
  'noResults',
  'listingMapContainer',
  'loadAll',
] as const

const StoreList = ({
  orderForm: { called: ofCalled, loading: ofLoading, orderForm: ofData },
  googleMapsKeys,
  icon,
  iconWidth,
  iconHeight,
}) => {
  const [getStores, { data, loading, called }] = useLazyQuery<StoresResult>(
    GET_STORES
  )

  const [state, setState] = useState<ListState>({
    allLoaded: false,
    center: null,
    zoom: 10,
  })

  const handles = useCssHandles(CSS_HANDLES)

  const loadAll = () => {
    setState({
      ...state,
      allLoaded: true,
    })
    getStores({
      variables: {
        location: null,
        limit: 10,
      },
    })
  }

  if (ofCalled && !ofLoading && !called) {
    if (ofData.shippingData?.address?.postalCode) {
      getStores({
        variables: {
          location: ofData.shippingData.address.postalCode,
          limit: 10,
        },
      })
    } else {
      loadAll()
    }
  }

  const handleCenter = (center: number[], zoom: number) => {
    setState({
      ...state,
      center,
      zoom,
    })
  }

  if (called) {
    if (!loading && !!data && data.getStores.items.length === 0) {
      loadAll()
    }

    if (!state.center && data?.getStores?.items.length) {
      const [firstResult] = data.getStores.items
      const { latitude, longitude } = firstResult.address.location
      const center = ofData.shippingData?.address?.geoCoordinates ?? [
        longitude,
        latitude,
      ]

      handleCenter(center, 10)
    }

    const stores = data?.getStores?.items ?? []

    return (
      <div className={`flex flex-row ${handles.container}`}>
        <div className={`flex-col w-30 ${handles.storesListCol}`}>
          {loading && <Spinner />}
          {!loading && !!data && stores.length > 0 && (
            <div className={`overflow-auto h-100 ${handles.storesList}`}>
              <Listing items={stores} onChangeCenter={handleCenter} />
              {!state.allLoaded && (
                <span
                  className={`mt2 link c-link underline-hover pointer ${handles.loadAll}`}
                  onClick={() => {
                    loadAll()
                  }}
                >
                  <FormattedMessage id="store/load-all" />
                </span>
              )}
            </div>
          )}
          {!loading && !!data && stores.length === 0 && (
            <div className={handles.noResults}>
              <FormattedMessage id="store/none-stores" />
            </div>
          )}
        </div>
        <div className={`flex-col w-70 ${handles.storesMapCol}`}>
          {!loading &&
            !!data &&
            stores.length > 0 &&
            googleMapsKeys?.logistics?.googleMapsKey && (
              <Pinpoints
                googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${googleMapsKeys.logistics.googleMapsKey}&v=3.exp&libraries=geometry,drawing,places`}
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={
                  <div
                    className={handles.listingMapContainer}
                    style={{ height: `100%` }}
                  />
                }
                mapElement={<div style={{ height: `100%` }} />}
                items={data.getStores.items}
                zoom={state.zoom}
                center={state.center}
                icon={icon}
                iconWidth={iconWidth}
                iconHeight={iconHeight}
              />
            )}
        </div>
      </div>
    )
  }

  return null
}

export default compose(
  graphql(ORDER_FORM, {
    name: 'orderForm',
    options: {
      ssr: false,
    },
  }),
  graphql(GOOGLE_KEYS, {
    name: 'googleMapsKeys',
    options: {
      ssr: false,
    },
  })
)(StoreList)
