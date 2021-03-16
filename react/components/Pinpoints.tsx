/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react'
import { useIntl, defineMessages } from 'react-intl'
import {
  GoogleMap,
  Marker,
  withGoogleMap,
  withScriptjs,
  InfoWindow,
} from 'react-google-maps'
import slugify from 'slugify'
import { useRuntime } from 'vtex.render-runtime'
import { useCssHandles } from 'vtex.css-handles'

import { SpecificationGroup } from '../typings/store'

const Slugify = (str: string) => {
  return slugify(str, { lower: true, remove: /[*+~.()'"!:@]/g })
}

const CSS_HANDLES = [
  'markerInfo',
  'markerInfoLinkContainer',
  'markerInfoLink',
  'markerInfoAddressStreet',
  'markerInfoAddress',
  'markerInfoHours',
  'markerInfoDirectionsLink',
  'markerInfoStoreName',
  'markerInfoAddress',
] as const

const messages = defineMessages({
  hoursLabel: {
    defaultMessage: '',
    id: 'store/yext-store-locator.hours-label',
  },
  '0': {
    defaultMessage: '',
    id: 'store/yext-store-locator.short-day-sunday',
  },
  '1': {
    defaultMessage: '',
    id: 'store/yext-store-locator.short-day-monday',
  },
  '2': {
    defaultMessage: '',
    id: 'store/yext-store-locator.short-day-tuesday',
  },
  '3': {
    defaultMessage: '',
    id: 'store/yext-store-locator.short-day-wednesday',
  },
  '4': {
    defaultMessage: '',
    id: 'store/yext-store-locator.short-day-thursday',
  },
  '5': {
    defaultMessage: '',
    id: 'store/yext-store-locator.short-day-friday',
  },
  '6': {
    defaultMessage: '',
    id: 'store/yext-store-locator.short-day-saturday',
  },
})

interface PinpointProps {
  items: SpecificationGroup[]
  onChangeCenter: (lon: number, lat: number, zoomSize: number) => void
  zoom: number
  center: number[]
  icon: string
  iconWidth: string
  iconHeight: string
}

const Pinpoints = withScriptjs(
  withGoogleMap<PinpointProps>((props) => {
    const [state, setState] = useState({
      markerState: {},
    })

    const handles = useCssHandles(CSS_HANDLES)
    const { navigate } = useRuntime()
    const { formatMessage } = useIntl()
    const [lng, lat] = props.center
    const { zoom } = props

    const handleMarkState = (id: string) => {
      const markerState = !state.markerState[id]
        ? {
            [id]: true,
          }
        : {}

      setState({
        markerState,
      })
    }

    const goTo = (item: any) => {
      const { state: _state, postalCode } = item.address

      navigate({
        page: 'store.storedetail',
        params: {
          slug: `${Slugify(`${item.name} ${_state} ${postalCode}`)}`,
          store_id: item.id,
        },
      })
    }

    let icon: any = {
      url: props.icon ?? null,
    }

    if (props.iconWidth && props.iconHeight) {
      icon = {
        ...icon,
        scaledSize: {
          width: props.iconWidth,
          height: props.iconHeight,
        },
      }
    }

    return (
      <GoogleMap defaultZoom={10} zoom={zoom} center={{ lat, lng }}>
        {props.items.map((item, i: number) => {
          const { latitude, longitude } = item.address.location

          return (
            <Marker
              key={`marker_${i}`}
              icon={icon?.url}
              position={{ lat: latitude, lng: longitude }}
              onClick={() => {
                handleMarkState(item.id)
              }}
            >
              {(state.markerState[item.id] ||
                (Object.getOwnPropertyNames(state.markerState).length === 0 &&
                  lat === latitude &&
                  lng === longitude)) && (
                <InfoWindow
                  onCloseClick={() => {
                    handleMarkState(item.id)
                  }}
                >
                  <div className={`t-mini ${handles.markerInfo}`}>
                    <div className={`${handles.markerInfoLinkContainer}`}>
                      <span
                        className={`mt2 link c-link underline-hover pointer ${handles.markerInfoLink}`}
                        onClick={(e) => {
                          e.preventDefault()
                          goTo(item)
                        }}
                      >
                        {`${item.name} - ${item.address.city}`}
                      </span>
                    </div>
                    <br />
                    <div className={handles.markerInfoAddressStreet}>
                      {item.address.number ? `${item.address.number} ` : ''}
                      {`${item.address.street},`}
                    </div>
                    <div className={handles.markerInfoAddress}>
                      {item.address.city ? `${item.address.city}` : ''}
                      {item.address.state ? `, ${item.address.state}` : ''}
                      {item.address.postalCode
                        ? ` ${item.address.postalCode}`
                        : ''}
                      <br />
                      {item.mainPhone ? `${item.mainPhone}` : ''}
                    </div>
                    <br />
                    {item.businessHours.map((hours, index: number) => {
                      return (
                        <div
                          key={`hour_${index}`}
                          className={handles.markerInfoHours}
                        >
                          <span className="">
                            {formatMessage(messages[hours.dayOfWeek])}
                          </span>
                          <br />
                          <span className="">{hours.hoursDisplay}</span>
                        </div>
                      )
                    })}
                    <br />
                    <a
                      className={`${handles.markerInfoDirectionsLink} vtex-link`}
                      href={item.googleMapLink}
                    >
                      {formatMessage({
                        id: 'store/yext-store-locator.pinpoints.directions',
                      })}
                    </a>
                  </div>
                </InfoWindow>
              )}
            </Marker>
          )
        })}
      </GoogleMap>
    )
  })
)

export default Pinpoints
