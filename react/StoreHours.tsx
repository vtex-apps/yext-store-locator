import React from 'react'
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

import { useStoreGroup } from './StoreGroup'
import { BusinessHours } from './typings/store'
import timeFormat from './utils/timeFormat'

const CSS_HANDLES = [
  'hoursContainer',
  'hoursLabel',
  'hourRow',
  'dayOfWeek',
  'businessHours',
] as const

interface StoreHoursProps {
  label?: string
  format?: '12H' | '24H'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  intl: any
}

const messages = defineMessages({
  title: {
    defaultMessage: '',
    id: 'admin/editor.storeHours.title',
  },
  description: {
    defaultMessage: '',
    id: 'admin/editor.storeHours.description',
  },
  labelTitle: {
    defaultMessage: '',
    id: 'admin/editor.storeHoursLabel.title',
  },
  labelDescription: {
    defaultMessage: '',
    id: 'admin/editor.storeHoursLabel.description',
  },
  formatTitle: {
    defaultMessage: '',
    id: 'admin/editor.storeHoursFormat.title',
  },
  formatDescription: {
    defaultMessage: '',
    id: 'admin/editor.storeHoursFormat.description',
  },
  '0': {
    defaultMessage: 'Sunday',
    id: 'store/yext-store-locator.day-of-week-sunday',
  },
  '1': {
    defaultMessage: 'Monday',
    id: 'store/yext-store-locator.day-of-week-monday',
  },
  '2': {
    defaultMessage: 'Tuesday',
    id: 'store/yext-store-locator.day-of-week-tuesday',
  },
  '3': {
    defaultMessage: 'Wednesday',
    id: 'store/yext-store-locator.day-of-week-wednesday',
  },
  '4': {
    defaultMessage: 'Thursday',
    id: 'store/yext-store-locator.day-of-week-thursday',
  },
  '5': {
    defaultMessage: 'Friday',
    id: 'store/yext-store-locator.day-of-week-friday',
  },
  '6': {
    defaultMessage: 'Saturday',
    id: 'store/yext-store-locator.day-of-week-saturday',
  },
})

const StoreHours: StorefrontFunctionComponent<StoreHoursProps> = ({
  label,
  format,
  intl,
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  const group = useStoreGroup()

  if (!group) {
    return null
  }

  const displayTime = (item: BusinessHours) => {
    const openTime = item?.openingTime && timeFormat(item.openingTime, format)
    const closeTime = item?.closingTime && timeFormat(item.closingTime, format)

    if (!openTime && !closeTime) {
      return `Closed`
    }

    return `${openTime ?? ''} - ${closeTime ?? ''}`
  }

  return (
    <div className={`${handles.hoursContainer} mh5`}>
      <div className={`b mb5 t-heading-6 ${handles.hoursLabel}`}>
        {label ?? (
          <FormattedMessage id="store/yext-store-locator.storeHours.labela" />
        )}
      </div>
      <div>
        {group.businessHours.map((hours, i) => {
          return (
            <div
              key={`hour_${i}`}
              className={`${handles.hourRow} mv2 flex justify-between`}
            >
              <div className={handles.dayOfWeek}>
                {intl.formatMessage(messages[hours.dayOfWeek])}
              </div>
              <div className={handles.businessHours}>{displayTime(hours)}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

StoreHours.defaultProps = {
  label: undefined,
  format: undefined,
}

StoreHours.schema = {
  title: messages.title.id,
  description: messages.description.id,
  type: 'object',
  properties: {
    label: {
      title: messages.labelTitle.id,
      description: messages.labelDescription.id,
      type: 'string',
      isLayout: false,
      default: '',
    },
    format: {
      title: messages.labelTitle.id,
      description: messages.labelDescription.id,
      type: 'string',
      enum: ['12H', '24H'],
      isLayout: false,
      default: '12H',
    },
  },
}

export default injectIntl(StoreHours)
