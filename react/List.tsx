/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react'
import { graphql, compose, useLazyQuery } from 'react-apollo'
import { InputSearch, Spinner } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'

import { StoresResult } from './typings/store'
import ORDER_FORM from './queries/orderForm.graphql'
import GET_STORES from './queries/getStores.graphql'
import GOOGLE_KEYS from './queries/GetGoogleMapsKey.graphql'
import Listing from './components/Listing'
import Pinpoints from './components/Pinpoints'

const CSS_HANDLES = [
  'storeLocatorBlock',
  'storeLocatorsearchContainer',
  'storeLocatorsearchInput',
  'storeLocatorsearchSpinner',
  'storeLocatorContainer',
  'storeLocatorMapContainer',
  'storeLocatorMap',
] as const

const StoreList: StorefrontFunctionComponent<any> = ({
  orderForm: { called: ofCalled, loading: ofLoading, orderForm: ofData },
  googleMapsKeys,
  icon,
  iconWidth,
  iconHeight,
}) => {
  const [getStores, { data, loading, called }] = useLazyQuery<StoresResult>(
    GET_STORES
  )

  const [search, setSearch] = useState<string>('')
  const [longitude, setLongitude] = useState<number>(0)
  const [latitude, setLatitude] = useState<number>(0)
  const [update, setUpdate] = useState<boolean>(false)
  const [zoom, setZoom] = useState<number>(6)

  const handles = useCssHandles(CSS_HANDLES)

  const loadAll = (location: string) => {
    setUpdate(!update)

    getStores({
      variables: {
        filter: `{"closed":{"$eq":false}}`,
        location: location || null,
        limit: 15,
      },
    })
  }

  const handleCenter = (lon: number, lat: number, zoomSize: number) => {
    setLongitude(lon)
    setLatitude(lat)
    setZoom(zoomSize)
  }

  if (ofCalled && !ofLoading && !called) {
    if (ofData.shippingData?.address?.postalCode) {
      loadAll(ofData.shippingData.address.postalCode)
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: Position) => {
          const { longitude: lon, latitude: lat } = position.coords

          setLongitude(lon)
          setLatitude(lat)
          loadAll(`${lat},${lon}`)
        },
        () => {
          loadAll('')
        }
      )
    } else {
      loadAll('')
    }
  }

  if (called && googleMapsKeys?.logistics?.googleMapsKey) {
    if (!loading && data?.getStores.items.length === 0) {
      loadAll('')
    }

    if ((!latitude || !longitude || update) && data?.getStores) {
      if (data.getStores.location) {
        handleCenter(
          data.getStores.location.longitude,
          data.getStores.location.latitude,
          6
        )
      } else if (data.getStores.items[0]) {
        const {
          longitude: lon,
          latitude: lat,
        } = data.getStores.items[0].address.location

        handleCenter(lon, lat, 6)
      }

      setUpdate(!update)
    }

    const stores = data?.getStores?.items ?? []

    return (
      <div className={`${handles.storeLocatorBlock} mv5`}>
        <div
          className={`${handles.storeLocatorsearchContainer} flex items-center mb5`}
        >
          <div
            className={`${handles.storeLocatorsearchInput}`}
            style={{ width: '400px' }}
          >
            <InputSearch
              placeholder="Search City, State or Zip"
              value={search}
              size="large"
              onChange={(e: any) => setSearch(e.target.value)}
              onSubmit={(e: any) => {
                e.preventDefault()

                setUpdate(!update)
                loadAll(e.target.value)
              }}
            />
          </div>
          <div className={`${handles.storeLocatorsearchSpinner} ml6`}>
            {loading && <Spinner size={20} />}
          </div>
        </div>
        <div
          className={`${handles.storeLocatorContainer} flex flex-row-m flex-nowrap-m flex-column-s flex-wrap-s`}
        >
          <Listing items={stores} onChangeCenter={handleCenter} />
          <div
            className={`${handles.storeLocatorMapContainer} flex-grow-1 order-2-m order-1-s`}
          >
            {latitude !== 0 && (
              <Pinpoints
                googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${googleMapsKeys.logistics.googleMapsKey}&v=3.exp&libraries=geometry,drawing,places`}
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={
                  <div
                    className={handles.storeLocatorMap}
                    style={{ height: `100%` }}
                  />
                }
                mapElement={
                  <div className="h-100" style={{ minHeight: '400px' }} />
                }
                items={stores}
                onChangeCenter={handleCenter}
                zoom={zoom}
                center={[longitude, latitude]}
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
