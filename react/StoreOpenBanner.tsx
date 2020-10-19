import React, { Fragment } from 'react'
import { defineMessages } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

import { useStoreGroup } from './StoreGroup'
import timeFormat from './utils/timeFormat'

const CSS_HANDLES = ['storeOpenBanner']

const StoreOpenBanner: StorefrontFunctionComponent = () => {
  const handles = useCssHandles(CSS_HANDLES)
  const group = useStoreGroup()

  if (!group) {
    return null
  }

  const today = new Date().getDay()
  const hours = group.businessHours.find((e) => e.dayOfWeek === today)
  const closingTime = hours?.closingTime && timeFormat(hours.closingTime, '12H')

  return (
    <Fragment>
      {closingTime && (
        <div className={`${handles.storeOpenBanner} tc t-heading-4 mt7 mb4`}>
          Open Today Until {closingTime}
        </div>
      )}
    </Fragment>
  )
}

const messages = defineMessages({
  title: {
    defaultMessage: '',
    id: 'admin/editor.storeOpenBanner.title',
  },
  description: {
    defaultMessage: '',
    id: 'admin/editor.storeOpenBanner.description',
  },
})

StoreOpenBanner.schema = {
  title: messages.title.id,
  description: messages.description.id,
  type: 'object',
}

export default StoreOpenBanner
