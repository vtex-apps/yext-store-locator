import React, { useContext } from 'react'
import {
  defineMessages,
  FormattedDate,
  FormattedMessage,
  injectIntl,
} from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

import { StoreGroupContext } from './contexts/StoreGroupContext'

const CSS_HANDLES = [
  'hoursContainer',
  'normalHours',
  'holidayHours',
  'hoursLabel',
  'holidayHoursLabel',
  'hoursRow',
  'hoursDayOfWeek',
  'hoursText',
] as const

interface StoreHoursProps {
  label?: string
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
  intl,
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  const group = useContext(StoreGroupContext)

  if (!group) {
    return null
  }

  return (
    <div className={`${handles.hoursContainer} mh5`}>
      <div className={handles.normalHours}>
        <div className={`b mb5 t-heading-6 ${handles.hoursLabel}`}>
          {label ?? (
            <FormattedMessage id="store/yext-store-locator.storeHours.label" />
          )}
        </div>
        <div>
          {group.businessHours.map((hours, i) => {
            return (
              <div
                key={`hour_${i}`}
                className={`${handles.hoursRow} mv2 flex justify-between`}
              >
                <div className={handles.hoursDayOfWeek}>
                  {intl.formatMessage(messages[hours.dayOfWeek])}
                </div>
                <div className={handles.hoursText}>{hours.hoursDisplay}</div>
              </div>
            )
          })}
        </div>
      </div>

      {group.holidayHours?.length > 0 && (
        <div className={handles.holidayHours}>
          <div className={`b mv5 t-heading-7 ${handles.holidayHoursLabel}`}>
            <FormattedMessage id="store/yext-store-locator.storeHolidayHours.label" />
          </div>
          <div>
            {group.holidayHours.map((hours, i) => {
              return (
                <div
                  key={`hour_${i}`}
                  className={`${handles.hoursRow} mv2 flex justify-between`}
                >
                  <div className={handles.hoursDayOfWeek}>
                    {hours.label || (
                      <FormattedDate
                        month="short"
                        day="2-digit"
                        value={hours.date}
                      />
                    )}
                  </div>
                  <div className={handles.hoursText}>{hours.hoursDisplay}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

StoreHours.defaultProps = {
  label: undefined,
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
  },
}

export default injectIntl(StoreHours)
