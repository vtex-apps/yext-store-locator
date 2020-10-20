/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { ChangeEvent, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { graphql, compose, useLazyQuery } from 'react-apollo'
import { InputSearch, Spinner } from 'vtex.styleguide'
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

  const [search, setSearch] = useState<string | null>(null)
  const [state, setState] = useState<ListState>({
    allLoaded: false,
    center: null,
    zoom: 10,
  })

  const handles = useCssHandles(CSS_HANDLES)

  const loadAll = (location: string | null = null) => {
    setState({
      ...state,
      center: null,
      allLoaded: true,
    })
    getStores({
      variables: {
        location,
        limit: 10,
      },
    })
  }

  const handleSubmit = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()

    loadAll(event.target.value)
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

    if (!state.center && data?.getStores?.location) {
      const { latitude, longitude } = data.getStores.location
      const center = ofData.shippingData?.address?.geoCoordinates ?? [
        longitude,
        latitude,
      ]

      handleCenter(center, 10)
    }

    const stores = data?.getStores?.items ?? []

    return (
      <div className="mv5">
        <div className="flex items-center mb5">
          <div style={{ width: '400px' }}>
            <InputSearch
              placeholder="Search City, State or Zip"
              value={search}
              size="large"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSearch(e.target.value)
              }
              onSubmit={(e: ChangeEvent<HTMLInputElement>) => handleSubmit(e)}
            />
          </div>
          <div className="ml6">{loading && <Spinner size={20} />}</div>
        </div>
        <div
          className={`flex flex-row-m flex-nowrap-m flex-column-s flex-wrap-s ${handles.container}`}
        >
          {data && stores.length > 0 && (
            <Listing items={stores} onChangeCenter={handleCenter} />
          )}
          {!loading && !!data && stores.length === 0 && (
            <div className={handles.noResults}>
              <FormattedMessage id="store/none-stores" />
            </div>
          )}
          <div
            className={`flex-grow-1 order-2-m order-1-s ${handles.storesMapCol}`}
          >
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
                  mapElement={
                    <div className="h-100" style={{ minHeight: '400px' }} />
                  }
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
