import React, { Fragment, useContext } from 'react'
import { defineMessages } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

import { StoreGroupContext } from './contexts/StoreGroupContext'
import { getClosingTime } from './getClosingTime'

const CSS_HANDLES = ['openBanner']

const StoreOpenBanner: StorefrontFunctionComponent = () => {
  const handles = useCssHandles(CSS_HANDLES)
  const group = useContext(StoreGroupContext)

  if (!group) {
    return null
  }

  const closingTime = getClosingTime(group)

  return (
    <Fragment>
      {closingTime && (
        <div className={`${handles.openBanner} tc t-heading-4 mb7`}>
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
